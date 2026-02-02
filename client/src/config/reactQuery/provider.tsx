import { QueryClientProvider as BaseQueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { queryClient } from './client';

const QueryClientProvider = ({ children }: PropsWithChildren) => {
	return (
		<BaseQueryClientProvider client={queryClient}>
			{children}
		</BaseQueryClientProvider>
	);
};

export default QueryClientProvider;
