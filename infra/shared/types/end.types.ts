export type EndStateInput = {
	error?: string;
	vectorsCount: number;
} & (
	| {
			key: string;
	  }
	| {
			detail: { object: { key: string } };
	  }
);
