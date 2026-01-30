import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ChunkReturn } from '../shared/types/chunk.types';
import { Vector, EmbeddingReturn } from '../shared/types/embedding.types';

let genAI: GoogleGenerativeAI;

let embeddingModel: GenerativeModel;

const init = () => {
	if (genAI && embeddingModel) return;

	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		throw new Error('Gemini API key is not set in environment variables!');
	}

	genAI = new GoogleGenerativeAI(apiKey);

	embeddingModel = genAI.getGenerativeModel({
		model: 'gemini-embedding-001',
	});
};

const embedText = async (text: string) => {
	const result = await embeddingModel.embedContent(text);
	return result.embedding.values;
};

export const handler = async ({
	key,
	user,
	chunks,
}: ChunkReturn): Promise<EmbeddingReturn> => {
	if (!chunks || !Array.isArray(chunks)) {
		throw new Error('No chunks provided');
	}

	init();

	const vectors: Vector[] = [];

	for (const [idx, chunk] of chunks.entries()) {
		const values = await embedText(chunk);

		vectors.push({
			id: `${key}#${idx}`,
			values,
			metadata: {
				key,
				chunkIndex: idx,
				text: chunk,
			},
		});
	}

	return {
		key,
		user,
		vectors,
	};
};
