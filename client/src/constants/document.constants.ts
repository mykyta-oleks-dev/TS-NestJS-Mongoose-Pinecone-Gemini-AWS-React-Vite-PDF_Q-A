export const PDF_DOCUMENT_TYPE = 'application/pdf';

export const documentContentTypes = [PDF_DOCUMENT_TYPE] as const;

export const extensions = {
	[PDF_DOCUMENT_TYPE]: '.pdf',
} as const;
