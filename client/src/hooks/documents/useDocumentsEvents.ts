import { useDocumentStatusChange } from './useDocumentStatusChange';
import { useEffect } from 'react';
import { API_URL } from '@/constants/env.constants';
import type { DocumentStatusEventData } from '@/types/events.types';

export const useDocumentsEvents = (email: string) => {
	const mutation = useDocumentStatusChange();

	useEffect(() => {
		if (!email) return;

		const es = new EventSource(
			`${API_URL}/documents/events?email=${email}`,
			{
				withCredentials: false,
			},
		);

		es.onopen = () => {
			console.log('SSE connection established');
		};

		es.onmessage = (event) => {
			const { id, status } = JSON.parse(
				event.data,
			) as DocumentStatusEventData;

			console.log({ id, status });

			mutation.mutate(status);
		};

		return () => {
			es.close();
		};
	}, [mutation, email]);
};
