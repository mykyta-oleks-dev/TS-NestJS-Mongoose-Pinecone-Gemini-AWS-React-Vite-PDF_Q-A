import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChunkReturn } from '../shared/types/chunk.types';
import {
	EmbeddedChunk,
	EmbeddingReturn,
} from '../shared/types/embedding.types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const embeddingModel = genAI.getGenerativeModel({
	model: 'gemini-embedding-001',
});

const embedText = async (text: string) => {
	const result = await embeddingModel.embedContent(text);
	return result.embedding.values; // number[]
};

export const handler = async ({
	key,
	chunks,
}: ChunkReturn): Promise<EmbeddingReturn> => {
	if (!chunks || !Array.isArray(chunks)) {
		throw new Error('No chunks provided');
	}

	const embeddedChunks: EmbeddedChunk[] = [];

	for (const [idx, chunk] of chunks.entries()) {
		const vector = await embedText(chunk);

		embeddedChunks.push({
			id: `${key}#${idx}`,
			values: vector,
			metadata: {
				key,
				chunkIndex: idx,
			},
		});
	}

	return {
		key,
		vectors: embeddedChunks,
	};
};
