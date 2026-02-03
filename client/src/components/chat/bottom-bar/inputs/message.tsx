import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from '@/components/ui/input-group';
import { useCurrentDocument } from '@/hooks/documents/useCurrentDocument';
import { CircleXIcon, SendIcon } from 'lucide-react';

const Message = () => {
	const { data: document, error } = useCurrentDocument();

	if (error) {
		return <div>An unexpected error happened: {error.message}</div>;
	}

	const isProcessed = document?.status === 'success';

	return (
		<form className="flex-1">
			<InputGroup>
				<InputGroupTextarea
					disabled={!isProcessed}
					name="search"
					placeholder="Search"
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton disabled={!isProcessed} type="reset">
						<CircleXIcon />
					</InputGroupButton>
				</InputGroupAddon>
				<InputGroupAddon align="inline-end">
					<InputGroupButton disabled={!isProcessed} type="submit">
						<SendIcon />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
};

export default Message;
