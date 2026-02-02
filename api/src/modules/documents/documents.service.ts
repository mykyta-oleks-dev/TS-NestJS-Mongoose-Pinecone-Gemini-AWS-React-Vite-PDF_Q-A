import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, DocumentDocument } from './schemas/document.schema';
import { Model } from 'mongoose';
import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';
import { S3Service } from '../s3/s3.service';
import { randomUUID } from 'node:crypto';
import {
	extensions,
	MAX_FILE_SIZE,
	DOCUMENTS_S3_PREFIX,
} from '../../shared/constants/files.constants';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PineconeService } from '../pinecone/pinecone.service';
import {
	PineconeConfig,
	TypedConfigService,
} from '../../shared/types/config-service.types';

@Injectable()
export class DocumentsService {
	private readonly documentsIndex: string;

	constructor(
		@InjectModel(Document.name)
		private readonly documentModel: Model<DocumentDocument>,
		private readonly s3: S3Service,
		private readonly pinecone: PineconeService,
		private readonly configService: TypedConfigService,
	) {
		const pineconeConfig = configService.get<PineconeConfig>('pinecone');

		if (!pineconeConfig) {
			throw new Error('Pinecone configuration is missing');
		}

		this.documentsIndex = pineconeConfig.documentsIndex;
	}

	async generatePutPresignedUrl(
		body: GeneratePresignedUrlDto,
		email: string,
	) {
		await this.assertNoActiveDocument(email);

		if (body.size > MAX_FILE_SIZE) {
			throw new BadRequestException('File size must be less than 10MB');
		}

		const uuid = randomUUID();

		const tmpKey = this.s3.getTmpKey(uuid, body.contentType);

		const url = await this.s3.generatePutPresignedUrl(
			tmpKey,
			body.contentType,
			body.size,
		);

		return { url, uuid, key: tmpKey };
	}

	async finalizeUpload(body: CreateDocumentDto, email: string) {
		await this.assertNoActiveDocument(email);

		const fileHead = await this.s3.getFileHead(body.tempKey);

		const { ContentType } = fileHead;

		if (!ContentType) {
			throw new Error('Content type of source file is not set');
		}

		const extension =
			extensions.docs[ContentType as keyof typeof extensions.docs];

		if (!extension) {
			throw new BadRequestException(
				`Unsupported content type: ${ContentType}`,
			);
		}

		const fileName = body.fileName.endsWith(extension)
			? body.fileName
			: `${body.fileName}${extension}`;

		const key = `${DOCUMENTS_S3_PREFIX}/${email}/${fileName}`;

		await this.s3.moveFile(key, body.tempKey);

		const document = await this.documentModel.create({
			fileName,
			key,
			userEmail: email,
		});

		return { document };
	}

	async getCurrentDocument(userEmail: string) {
		const document = await this.documentModel.findOne({ userEmail });

		if (!document) {
			throw new NotFoundException(
				'There is no document uploaded by the user',
			);
		}

		return document;
	}

	async deleteCurrentDocument(userEmail: string) {
		const document = await this.getCurrentDocument(userEmail);

		await this.s3.deleteFile(document.key);

		await this.documentModel.deleteOne({ userEmail });

		await this.pinecone.delete(this.documentsIndex, userEmail);
	}

	updateStatus(body: UpdateStatusDto) {
		return this.documentModel.findOneAndUpdate(
			{
				key: body.key,
			},
			{
				status: body.success ? 'success' : 'error',
				vectorsCount:
					body.success && body.vectorsCount
						? body.vectorsCount
						: undefined,
			},
		);
	}

	// helpers

	private async assertNoActiveDocument(userEmail: string) {
		let existing: Document;

		try {
			existing = await this.getCurrentDocument(userEmail);
		} catch {
			return true;
		}

		if (existing) {
			throw new ConflictException('User already has document uploaded');
		}
	}
}
