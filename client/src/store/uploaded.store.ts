import type { Document, Status } from '@/types/document.types';
import { create } from 'zustand';

type UploadedStore = {
	document: Document | undefined;
	setDocument: (document: Document | undefined) => void;
	updateStatus: (status: Status) => void;
};

export const useUploadedFileStore = create<UploadedStore>((set) => ({
	document: undefined,
	setDocument: (document) => set({ document }),
	updateStatus: (status) =>
		set((prev) => ({
			...prev,
			document: prev.document && { ...prev.document, status },
		})),
}));
