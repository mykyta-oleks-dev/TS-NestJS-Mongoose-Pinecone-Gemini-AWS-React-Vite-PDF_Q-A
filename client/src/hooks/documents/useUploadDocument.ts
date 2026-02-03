import {
	finalizeUpload,
	generatePresignedURL,
	putDocument,
} from '@/api/documents';
import { validateFile } from '@/lib/validation';
import { useEmailStore } from '@/store/email.store';
import type { Document, DocumentContentType } from '@/types/document.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUploadDocument = () => {
	const email = useEmailStore((s) => s.email);
	const qc = useQueryClient();

	const key = ['documents', email];

	return useMutation({
		mutationFn: async (file: File) => {
			if (!validateFile(file) || !email) return;

			const { url, key } = await generatePresignedURL(
				file.type as DocumentContentType,
				file.size,
			);

			await putDocument(url, file);

			const document = await finalizeUpload(key, file.name);

			return document;
		},

		onMutate: async (file) => {
			if (!email) return;

			await qc.cancelQueries({ queryKey: ['documents'] });

			const prev = qc.getQueryData<Document | null>(key);

			// optimistic document
			const optimisticDoc: Document = {
				_id: crypto.randomUUID(),
				userEmail: email,
				fileName: file.name,
				key: 'pending',
				status: 'pending',
			};

			qc.setQueryData<Document>(key, () => optimisticDoc);

			return { prev };
		},

		onError: (_err, _file, ctx) => {
			if (ctx?.prev) {
				qc.setQueryData(key, ctx.prev);
			}

			toast.error(
				'There was an error during the upload process. Please try again later.',
			);
		},

		onSettled: () => {
			// server is source of truth
			qc.invalidateQueries({ queryKey: ['documents'] });

			toast.success(
				'The document is successfuly uploaded and saved! Please wait for its processing',
			);
		},
	});
};
