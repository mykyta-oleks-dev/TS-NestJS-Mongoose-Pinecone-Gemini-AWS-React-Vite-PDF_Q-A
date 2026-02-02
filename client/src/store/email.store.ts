import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type EmailStore = {
	email: string | undefined;
	setEmail: (email: string | undefined) => void;
};

export const useEmailStore = create<EmailStore>()(
	persist(
		(set) => ({
			email: undefined,
			setEmail: (email) => set({ email }),
		}),
		{ name: 'pdf-rag-email-auth' },
	),
);
