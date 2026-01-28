export type EmbeddedChunk = {
	id: string;
	values: number[];
	metadata: {
		key: string;
		chunkIndex: number;
	};
};

export type EmbeddingReturn = {
	key: string;
	vectors: EmbeddedChunk[];
};
