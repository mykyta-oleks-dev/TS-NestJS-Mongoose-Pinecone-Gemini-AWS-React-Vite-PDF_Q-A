import { ApiError, GoogleGenAI } from '@google/genai';
import { ChunkReturn } from '../shared/types/chunk.types';
import { Vector, EmbeddingReturn } from '../shared/types/embedding.types';

import { Index, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import { PineconeReturn } from '../shared/types/pinecone.types';
import { PineconeNotFoundError } from '@pinecone-database/pinecone/dist/errors';

let genAI: GoogleGenAI;

let pinecone: Pinecone;

let index: Index<RecordMetadata>;

const MAX_REQUESTS_PER_MINUTE = 100; // Gemini API rate limit for embedding requests
const EMBEDDING_BATCH_SIZE = 90; // Safe embedding batch size
const PINECONE_BATCH_SIZE = 100; // Pinecone batch size for upsert
const DELAY_BETWEEN_BATCHES = 60000; // 60 seconds in milliseconds

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const init = () => {
	if (genAI && pinecone && index) return;

	const genaiApiKey = process.env.GEMINI_API_KEY;

	if (!genaiApiKey) {
		throw new Error('Gemini API key is not set in environment variables!');
	}

	const pineconeApiKey = process.env.PINECONE_API_KEY;
	const indexName = process.env.PINECONE_INDEX;

	if (!pineconeApiKey || !indexName) {
		throw new Error(
			'Pinecone key and index name are not set in environment variables!',
		);
	}

	genAI = new GoogleGenAI({ apiKey: genaiApiKey });

	pinecone = new Pinecone({ apiKey: pineconeApiKey });
	index = pinecone.index(indexName);
};

const embeddingStep = async ({
	key,
	user,
	chunks,
}: ChunkReturn): Promise<EmbeddingReturn> => {
	try {
		const allEmbeddings = await embedAllChunks(chunks);

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
	} catch (error) {
		console.error('Embedding generation failed:', error);
		throw new Error(
			`Failed to generate embeddings for key ${key}: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`,
		);
	}
};

const pineconeStep = async ({
	key,
	user,
	vectors,
}: EmbeddingReturn): Promise<PineconeReturn> => {
	await clear(user);

	for (let i = 0; i < vectors.length; i += PINECONE_BATCH_SIZE) {
		await index
			.namespace(user)
			.upsert(vectors.slice(i, i + PINECONE_BATCH_SIZE));
	}

	return {
		key,
		user,
		vectorsCount: vectors.length,
	};
};

export const handler = async (input: ChunkReturn): Promise<PineconeReturn> => {
	const { chunks } = input;

	if (!chunks || !Array.isArray(chunks)) {
		throw new Error('No chunks provided');
	}

	init();

	const embeddingResult = await embeddingStep(input);

	return pineconeStep(embeddingResult);
};

async function embedTextBatch(chunks: string[]) {
	const result = await genAI.models.embedContent({
		model: 'gemini-embedding-001',
		contents: chunks,
		config: {
			outputDimensionality: 3072,
			taskType: 'RETRIEVAL_DOCUMENT',
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
}

function batchArray<T>(array: T[], batchSize: number): T[][] {
	const batches: T[][] = [];

	for (let i = 0; i < array.length; i += batchSize) {
		batches.push(array.slice(i, i + batchSize));
	}

	return batches;
}

async function embedAllChunks(chunks: string[]): Promise<number[][]> {
	const batches = batchArray(chunks, EMBEDDING_BATCH_SIZE);
	const allEmbeddings: number[][] = [];

	let maxRetries = 5;

	for (let i = 0; i < batches.length; i++) {
		try {
			const batchEmbeddings = await embedTextBatch(batches[i]);
			allEmbeddings.push(...batchEmbeddings);

			// If not the last batch, wait before next request
			if (i < batches.length - 1) {
				console.log(
					`Waiting ${DELAY_BETWEEN_BATCHES / 1000}s to respect rate limits...`,
				);
				await sleep(DELAY_BETWEEN_BATCHES);
			}
		} catch (error) {
			if (error instanceof ApiError) {
				// Check if it's a rate limit error
				if (
					(error.status === 429 ||
						error.message.includes('429') ||
						error.message.includes('rate limit')) &&
					maxRetries > 0
				) {
					await sleep(70000); // Wait longer on rate limit
					i--; // Retry this batch
					maxRetries--;
					continue;
				} else if (maxRetries <= 0) {
					throw new Error(`Max retries exceeded for batch ${i + 1}`);
				}
			}

			throw new Error(
				`Failed to embed batch ${i + 1}/${batches.length}: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`,
			);
		}
	}

	return allEmbeddings;
}

async function clear(user: string) {
	try {
		await index.namespace(user).deleteAll();
	} catch (err: unknown) {
		if (err instanceof PineconeNotFoundError) {
			console.log('No existing vectors to delete');
		} else {
			throw err;
		}
	}
}
