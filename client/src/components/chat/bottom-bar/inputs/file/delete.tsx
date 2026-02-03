import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useDeleteDocument } from '@/hooks/documents/useDeleteDocument';
import type { Document, Status } from '@/types/document.types';
import { CircleXIcon } from 'lucide-react';

const DeleteDocument = ({
	document,
	isLoading,
}: {
	document: Document;
	isLoading: boolean;
}) => {
	const { mutateAsync: deleteMutateAsync, isPending } = useDeleteDocument();

	const onDelete = async () => {
		await deleteMutateAsync();
	};

	const badgeClasses = getClasses(document.status);

	const deleteIsPending = isLoading || isPending;

	return (
		<div className="flex gap-3 items-center">
			<span>{document.fileName}</span>
			<Badge className={badgeClasses}>{document.status}</Badge>

			<AlertDialog>
				<AlertDialogTrigger asChild disabled={deleteIsPending}>
					<Button
						variant="link"
						className="text-gray-200"
						size="icon"
						disabled={deleteIsPending}
					>
						{deleteIsPending ? <Spinner /> : <CircleXIcon />}
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action will delete current document and clear
							the chat from related messages. The deletion cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={onDelete}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

function getClasses(status: Status) {
	switch (status) {
		case 'error':
			return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';
		case 'pending':
			return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
		default:
			return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
	}
}

export default DeleteDocument;
