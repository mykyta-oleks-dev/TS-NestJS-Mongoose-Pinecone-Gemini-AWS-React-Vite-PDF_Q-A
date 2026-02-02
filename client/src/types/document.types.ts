import { documentContentTypes } from '@/constants/document.constants';

export type DocumentContentType = (typeof documentContentTypes)[number];

export type Status = 'pending' | 'success' | 'error';

export interface Document {
	_id: string;
	userEmail: string;
	fileName: string;
	key: string;
	status: Status;
	vectorsCount?: number;
}
