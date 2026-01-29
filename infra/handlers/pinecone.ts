import { Index, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import { EmbeddingReturn } from '../shared/types/embedding.types';
import { PineconeReturn } from '../shared/types/pinecone.types';
import { PineconeNotFoundError } from '@pinecone-database/pinecone/dist/errors';

let pinecone: Pinecone;

let index: Index<RecordMetadata>;

const init = () => {
	if (pinecone && index) return;

	const apiKey = process.env.PINECONE_API_KEY;
	const indexName = process.env.PINECONE_INDEX;

	if (!apiKey || !indexName) {
		throw new Error(
			'Pinecone key and index name are not set in environment variables!',
		);
	}

	pinecone = new Pinecone({ apiKey });
	index = pinecone.index(indexName);
};

const clear = async (user: string) => {
	try {
		await index.namespace(user).deleteAll();
	} catch (err: unknown) {
		if (err instanceof PineconeNotFoundError) {
			console.log('No existing vectors to delete');
		} else {
			throw err;
		}
	}
};

export const handler = async ({
	key,
	user,
	vectors,
}: EmbeddingReturn): Promise<PineconeReturn> => {
	init();

	await clear(user);

	const BATCH_SIZE = 100;
	for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
		await index.namespace(user).upsert(vectors.slice(i, i + BATCH_SIZE));
	}

	return {
		key,
		user,
		vectorsCount: vectors.length,
	};
};
