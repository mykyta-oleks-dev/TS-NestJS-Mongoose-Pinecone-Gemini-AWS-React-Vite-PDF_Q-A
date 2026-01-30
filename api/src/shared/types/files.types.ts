import { PDF_DOCUMENT_TYPE } from '../constants/files.constants';

export const contentTypes = [PDF_DOCUMENT_TYPE] as const;

export type FilesContentType = (typeof contentTypes)[number];

export function isSupported(
	contentType: string,
): contentType is FilesContentType {
	return contentTypes.includes(contentType as FilesContentType);
}
