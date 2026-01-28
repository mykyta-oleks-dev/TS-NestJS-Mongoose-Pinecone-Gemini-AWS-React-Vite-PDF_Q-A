import { chunk } from 'llm-chunk';

const MAX_TOKENS = 500;
const OVERLAP = 50;

export const handler = async ({ key, text }: { key: string; text: string }) => {
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
		key,
	};
};
