import { Input } from '@/components/ui/input';
import { useUploadDocument } from '@/hooks/documents/useUploadDocument';
import type { ChangeEvent } from 'react';

const UploadDocument = ({ isLoading }: { isLoading: boolean }) => {
	const { mutateAsync: uploadMutateAsync, isPending: uploadIsPending } =
		useUploadDocument();

	const onSelect = async (e: ChangeEvent<HTMLInputElement, Event>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		await uploadMutateAsync(file);
	};

	return (
		<Input
			type="file"
			placeholder="foo.pdf"
			accept=".pdf"
			onChange={onSelect}
			disabled={isLoading || uploadIsPending}
		/>
	);
};

export default UploadDocument;
