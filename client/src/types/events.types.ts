import type { Status } from './document.types';

export type DocumentStatusEventData = {
	id: string;
	email: string;
	status: Status;
};
