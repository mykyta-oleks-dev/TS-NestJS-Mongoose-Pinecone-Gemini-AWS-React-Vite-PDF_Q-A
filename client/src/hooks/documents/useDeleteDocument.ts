import { deleteDocument } from '@/api/documents';
import { useEmailStore } from '@/store/email.store';
import { type Document } from '@/types/document.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteDocument() {
	const email = useEmailStore((s) => s.email);

	const qc = useQueryClient();

	const queryKey = ['documents', email];

	return useMutation({
		mutationFn: async () => {
			if (!email) return;

			await deleteDocument();
		},

		onError: (err) => {
			toast.error(
				`There was an error: ${err.message} during the delete process. Please try again later.`,
			);
		},

		onSettled: () => {
			qc.setQueryData<Document | null>(queryKey, () => null);
			qc.invalidateQueries({ queryKey: ['chat'], exact: false });

			toast.success('The file was deleted successfuly!');
		},
	});
}
