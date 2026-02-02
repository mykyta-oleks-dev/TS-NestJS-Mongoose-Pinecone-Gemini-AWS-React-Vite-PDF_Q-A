import { Injectable } from '@nestjs/common';
import { DocumentsService } from '../documents/documents.service';
import { GeminiService } from '../gemini/gemini.service';
import { PineconeService } from '../pinecone/pinecone.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	DocumentChatMessage,
	DocumentChatMessageDocument,
} from './schemas/message.schema';
import {
	PineconeConfig,
	TypedConfigService,
} from '../../shared/types/config-service.types';
import { DocumentVector } from '../../shared/types/embedding.types';

@Injectable()
export class ChatService {
	private readonly documentsIndex: string;

	constructor(
		@InjectModel(DocumentChatMessage.name)
		private readonly chatMessageModel: Model<DocumentChatMessageDocument>,
		private readonly documents: DocumentsService,
		private readonly gemini: GeminiService,
		private readonly pinecone: PineconeService,
		private readonly configService: TypedConfigService,
	) {
		const pineconeConfig = configService.get<PineconeConfig>('pinecone');

		if (!pineconeConfig) {
			throw new Error('Pinecone configuration is missing');
		}

		this.documentsIndex = pineconeConfig.documentsIndex;
	}

	async askOnDocument(email: string, question: string) {
		const document =
			await this.documents.getCurrentDocumentIfSuccess(email);

		const vectorQuestion = await this.embedQuestion(question);

		const context = await this.getContext(email, vectorQuestion);

		const answer = await this.gemini.answer(question, context);

		const chatMessage = await this.chatMessageModel.create({
			document: document.id,

			question,
			answer,
		});

		return chatMessage;
	}

	async getMessages(email: string) {
		const document =
			await this.documents.getCurrentDocumentIfSuccess(email);

		return this.chatMessageModel
			.find({
				document: document.id,
			})
			.sort({ createdAt: 'asc' })
			.exec();
	}

	private async embedQuestion(question: string) {
		const vectorQuestion = (
			await this.gemini.embedding([question], 'query')
		)[0];

		if (!vectorQuestion?.length) {
			throw new Error('Error embedding the question');
		}

		return vectorQuestion;
	}

	private async getContext(email: string, vectorQuestion: number[]) {
		const chunks = await this.pinecone.query<DocumentVector>(
			this.documentsIndex,
			email,
			vectorQuestion,
		);

		const context = chunks.reduce(
			(prev, curr) =>
				`${prev}

Chunk: ${curr.metadata.chunkIndex}
Text: ${curr.metadata.text}`.trim(),
			'',
		);

		return context;
	}
}
