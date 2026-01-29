import { chunk } from 'llm-chunk';
import { ExtractReturn } from '../shared/types/extract.types';
import { ChunkReturn } from '../shared/types/chunk.types';

const MAX_TOKENS = 500;
const OVERLAP = 50;

export const handler = async ({
	key,
	user,
	text,
}: ExtractReturn): Promise<ChunkReturn> => {
	if (!text) {
		throw new Error('No text provided for chunking');
	}

	const chunks = chunk(text, {
		minLength: 0,
		maxLength: MAX_TOKENS,
		splitter: 'paragraph',
		overlap: OVERLAP,
	});

	return {
		chunks,
		user,
		key,
	};
};
