import { getMessages } from '@/api/chat';
import { useEmailStore } from '@/store/email.store';
import type { Document } from '@/types/document.types';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

export const useMessages = (document?: Document | null) => {
	const email = useEmailStore((s) => s.email);

	return useQuery({
		queryKey: ['chat', email],
		enabled: !!email && !!document,
		queryFn: async () => {
			try {
				return await getMessages();
			} catch (err) {
				if (isAxiosError(err) && err.response?.status === 404) {
					return null;
				}

				throw err;
			}
		},
	});
};
