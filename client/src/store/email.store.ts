import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type BearStore = {
	email: string | undefined;
	setEmail: (email: string | undefined) => void;
};

export const useEmailStore = create<BearStore>()(
	persist(
		(set) => ({
			email: undefined,
			setEmail: (email) => set({ email }),
		}),
		{ name: 'pdf-rag-email-auth' },
	),
);
