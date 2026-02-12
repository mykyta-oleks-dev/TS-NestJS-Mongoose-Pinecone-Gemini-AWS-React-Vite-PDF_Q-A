import { chunk } from 'llm-chunk';
import { ExtractReturn } from '../shared/types/extract.types';
import { ChunkReturn } from '../shared/types/chunk.types';

// 1 token is 3-4 characters
// ~500 tokens is 2000 characters
// ~1500 tokens is 6000 characters
// Maximum tokens for gemini-embedding-001 is 2048
const MAX_CHARACTERS = 6000;
const MIN_CHARACTERS = 5000;
const OVERLAP = 200;

export const handler = async ({
	key,
	user,
	text,
}: ExtractReturn): Promise<ChunkReturn> => {
	if (!text) {
		throw new Error('No text provided for chunking');
	}

	const chunks = chunk(text, {
		minLength: MIN_CHARACTERS,
		maxLength: MAX_CHARACTERS,
		splitter: 'sentence',
		overlap: OVERLAP,
	});

	return {
		chunks,
		user,
		key,
	};
};
