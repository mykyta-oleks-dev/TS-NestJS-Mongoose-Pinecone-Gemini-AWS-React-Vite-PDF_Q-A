export type EmbeddingTask = 'document' | 'query';

export const TASK_MAP = {
	document: 'RETRIEVAL_DOCUMENT',
	query: 'RETRIEVAL_QUERY',
} as const;

export type DocumentVector = {
	id: string;
	values: number[];
	metadata: {
		key: string;
		chunkIndex: number;
		text: string;
	};
};
