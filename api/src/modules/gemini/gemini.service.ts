import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import {
	GeminiConfig,
	TypedConfigService,
} from '../../shared/types/config-service.types';
import { EmbeddingTask, TASK_MAP } from '../../shared/types/embedding.types';

@Injectable()
export class GeminiService {
	private readonly genai: GoogleGenAI;

	constructor(private readonly configService: TypedConfigService) {
		const geminiConfig = configService.get<GeminiConfig>('gemini');

		if (!geminiConfig) {
			throw new Error('Pinecone configuration is missing');
		}

		this.genai = new GoogleGenAI({
			apiKey: geminiConfig.apiKey,
		});
	}

	async embedding(contents: string[], taskType: EmbeddingTask) {
		const res = await this.genai.models.embedContent({
			model: 'gemini-embedding-001',
			contents,
			config: {
				outputDimensionality: 3072,
				taskType: TASK_MAP[taskType],
			},
		});

		if (!res.embeddings || res.embeddings.length < contents.length) {
			throw new Error('Failed to embed string contents');
		}

		return res.embeddings.map((e) => e.values);
	}

	async answer(question: string, context: string) {
		const { text } = await this.genai.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: {
				role: 'user',
				parts: [
					{
						text: `
You are a helpful assistant answering questions strictly based on the provided context.
If the answer cannot be found in the context, say that you don't know.
Do not use external knowledge.
When answering, cite the text piece from context you used in square brackets.

Context:
${context}

Question:
${question}

Answer:
					`.trim(),
					},
				],
			},
		});

		if (!text) {
			throw new Error('Error retrieving text answer');
		}

		return text;
	}
}
