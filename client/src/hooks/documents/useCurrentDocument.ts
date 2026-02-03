import { getDocument } from '@/api/documents';
import { useEmailStore } from '@/store/email.store';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useCurrentDocument = () => {
	const email = useEmailStore((s) => s.email);

	return useQuery({
		enabled: !!email,
		queryKey: ['documents', email],
		queryFn: async () => {
			if (!email) return;

			try {
				return await getDocument();
			} catch (err) {
				if (err instanceof AxiosError && err.response?.status === 404) {
					return null;
				}

				throw err;
			}
		},
	});
};
