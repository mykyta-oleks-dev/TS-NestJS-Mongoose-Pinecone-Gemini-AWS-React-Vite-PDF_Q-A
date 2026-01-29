export type Vector = {
	id: string;
	values: number[];
	metadata: {
		key: string;
		chunkIndex: number;
	};
};

export type EmbeddingReturn = {
	key: string;
	user: string;
	vectors: Vector[];
};
