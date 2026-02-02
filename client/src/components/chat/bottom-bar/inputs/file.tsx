import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUploadedFileStore } from '@/store/uploaded.store';
import { CircleXIcon } from 'lucide-react';
import type { ChangeEvent } from 'react';

const FileInput = () => {
	const { document, setDocument } = useUploadedFileStore();

	const onSelect = (e: ChangeEvent<HTMLInputElement, Event>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setDocument({
			_id: '1',
			fileName: file.name,
			key: 'file',
			status: 'pending',
			userEmail: 'a@b.c',
		});
	};

	return (
		<div>
			{document ? (
				<div className="flex gap-3 items-center">
					<span>{document.fileName}</span>
					<Button
						onClick={() => setDocument(undefined)}
						variant="link"
						className="text-gray-200"
						size="icon"
					>
						<CircleXIcon />
					</Button>
				</div>
			) : (
				<div>
					<Input
						type="file"
						placeholder="foo.pdf"
						accept=".pdf"
						onChange={onSelect}
					/>
				</div>
			)}
		</div>
	);
};

export default FileInput;
