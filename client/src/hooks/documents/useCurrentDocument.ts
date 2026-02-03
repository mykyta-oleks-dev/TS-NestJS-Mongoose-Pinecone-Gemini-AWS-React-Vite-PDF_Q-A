import { getDocument } from '@/api/documents';
import { useEmailStore } from '@/store/email.store';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

export const useCurrentDocument = () => {
	const email = useEmailStore((s) => s.email);

	return useQuery({
		enabled: !!email,
		queryKey: ['documents', email],
		retry: (_failureCount, error) =>
			!(isAxiosError(error) && error.response?.status === 404),
		queryFn: async () => {
			if (!email) return;

			try {
				return await getDocument();
			} catch (err) {
				if (isAxiosError(err) && err.response?.status === 404) {
					return;
				}

				throw err;
			}
		},
	});
};
