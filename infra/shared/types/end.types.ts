export type EndStateInput = {
	error?: string | object;
	vectorsCount: number;
} & (
	| {
			key: string;
	  }
	| {
			detail: { object: { key: string } };
	  }
);
