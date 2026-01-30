export const PDF_DOCUMENT_TYPE = 'application/pdf';

export const extensions = {
	docs: {
		[PDF_DOCUMENT_TYPE]: '.pdf',
	},
};

export const TMP_S3_PREFIX = 'tmp';
export const DOCUMENTS_S3_PREFIX = 'docs';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
