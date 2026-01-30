import { GoogleGenAI } from '@google/genai';
import { ChunkReturn } from '../shared/types/chunk.types';
import { Vector, EmbeddingReturn } from '../shared/types/embedding.types';

let genAI: GoogleGenAI;

const init = () => {
	if (genAI) return;

	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		throw new Error('Gemini API key is not set in environment variables!');
	}

	genAI = new GoogleGenAI({ apiKey });
};

const embedTextBatch = async (chunks: string[]) => {
	const result = await genAI.models.embedContent({
		model: 'gemini-embedding-001',
		contents: chunks,
		config: {
			outputDimensionality: 3072,
			taskType: 'QUESTION_ANSWERING',
		},
	});

	if (!result.embeddings) {
		throw new Error('No embeddings returned from API');
	}

	if (result.embeddings.length !== chunks.length) {
		throw new Error(
			`Expected ${chunks.length} embeddings but got ${result.embeddings.length}`,
		);
	}

	return result.embeddings.map((emb, idx) => {
		if (!emb?.values) {
			throw new Error(`Embedding at index ${idx} has no values`);
		}
		return emb.values;
	});
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

	const allEmbeddings = await embedTextBatch(chunks);

	const vectors: Vector[] = allEmbeddings.map((values, idx) => ({
		id: `${key}#${idx}`,
		values,
		metadata: {
			key,
			chunkIndex: idx,
			text: chunks[idx],
		},
	}));

	return {
		key,
		user,
		vectors,
	};
};
