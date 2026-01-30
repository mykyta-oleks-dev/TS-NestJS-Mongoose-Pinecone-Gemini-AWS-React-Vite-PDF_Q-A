export type Vector = {
	id: string;
	values: number[];
	metadata: {
		key: string;
		chunkIndex: number;
		text: string;
	};
};

export type EmbeddingReturn = {
	key: string;
	user: string;
	vectors: Vector[];
};
