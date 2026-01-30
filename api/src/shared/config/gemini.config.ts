import { registerAs } from '@nestjs/config';
import { GeminiConfig } from '../types/config-service.types';

const geminiConfig = registerAs(
	'gemini',
	(): GeminiConfig => ({
		apiKey: process.env.GEMINI_API_KEY ?? '',
	}),
);

export default geminiConfig;
