import {
	documentContentTypes,
	extensions,
} from '@/constants/document.constants';
import { type DocumentContentType } from '@/types/document.types';
import { toast } from 'sonner';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const isEmail = (value: string) => EMAIL_REGEX.test(value);

export function validateFile(file: File) {
	if (!documentContentTypes.includes(file.type as DocumentContentType)) {
		const extensionValues = Object.values(extensions).join(', ');

		toast.error(
			`Only files of the following extensions are allowed: ${extensionValues}`,
		);
		return false;
	}

	if (file.size > MAX_FILE_SIZE) {
		toast.error('File size must be less than 10MB');
		return false;
	}

	return true;
}
