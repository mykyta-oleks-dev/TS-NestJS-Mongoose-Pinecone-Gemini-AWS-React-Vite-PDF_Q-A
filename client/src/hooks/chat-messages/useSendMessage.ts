import { sendMessage } from '@/api/chat';
import { useEmailStore } from '@/store/email.store';
import type { Document } from '@/types/document.types';
import type { AppMessage } from '@/types/message.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSendMessage = (document?: Document | null) => {
	const email = useEmailStore((s) => s.email);
	const qc = useQueryClient();

	const key = ['chat', email];

	return useMutation({
		mutationFn: async (message: string) => {
			if (!email || !document) return;

			return await sendMessage(message);
		},

		onMutate: (question) => {
			if (!email || !document) return;

			const optimisticMessage: AppMessage = {
				_id: 'new',
				createdAt: new Date(),
				document: document._id,
				question,
			};

			const prev = qc.getQueryData<AppMessage[] | undefined>(key);

			qc.setQueryData<AppMessage[] | undefined>(key, (old) => [
				...(old ?? []),
				optimisticMessage,
			]);

			return { prev };
		},

		onError: (_err, _file, ctx) => {
			if (ctx?.prev) {
				qc.setQueryData(key, ctx.prev);
			}

			toast.error(
				'There was an error with message processing. Please try again later.',
			);
		},

		onSettled: (message, error, _question, ctx) => {
			// server is source of truth
			if (message && !error) {
				qc.setQueryData<AppMessage[]>(key, () => [
					...(ctx?.prev ?? []),
					message,
				]);
			}
		},
	});
};
