import { useCurrentDocument } from '@/hooks/documents/useCurrentDocument';
import { toast } from 'sonner';
import DeleteDocument from './delete';
import UploadDocument from './upload';

const FileInput = () => {
	const {
		data: document,
		isLoading,
		error: queryError,
	} = useCurrentDocument();

	if (queryError) {
		console.log('error');
		toast.error(`Failed to load the ${queryError.message}`);
	}

	return document ? (
		<DeleteDocument document={document} isLoading={isLoading} />
	) : (
		<UploadDocument isLoading={isLoading} />
	);
};

export default FileInput;
