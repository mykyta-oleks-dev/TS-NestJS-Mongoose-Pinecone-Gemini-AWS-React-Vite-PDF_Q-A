import { useEmailStore } from '@/store/email.store';
import { type Document, type Status } from '@/types/document.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDocumentStatusChange = () => {
	const email = useEmailStore((s) => s.email);

	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (status: Status) => {
			if (!email) return;

			qc.setQueryData<Document>(
				['documents', email],
				(old?: Document | null) => {
					if (!old) return;

					return {
						...old,
						status,
					};
				},
			);

			if (status === 'success') {
				toast.success('The document was processed successfuly!');
			} else if (status === 'error') {
				toast.error('There was and error in processing the document');
			}
		},
	});
};
