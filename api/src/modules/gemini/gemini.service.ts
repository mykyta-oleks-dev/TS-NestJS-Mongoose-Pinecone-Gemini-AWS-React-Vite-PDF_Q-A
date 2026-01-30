import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import {
	GeminiConfig,
	TypedConfigService,
} from '../../shared/types/config-service.types';

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
}
