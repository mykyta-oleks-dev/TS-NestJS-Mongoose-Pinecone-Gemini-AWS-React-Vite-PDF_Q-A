import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from '@/components/ui/input-group';
import { useSendMessage } from '@/hooks/chat-messages/useSendMessage';
import { useCurrentDocument } from '@/hooks/documents/useCurrentDocument';
import { CircleXIcon, SendIcon } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';

const Message = () => {
	const [message, setMessage] = useState('');

	const { data: document, error } = useCurrentDocument();
	const { mutateAsync, isPending } = useSendMessage(document);

	if (error) {
		return <div>An unexpected error happened: {error.message}</div>;
	}

	const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmed = message.trim();

		setMessage(trimmed);

		console.log(trimmed, trimmed.length);

		if (!trimmed.length) return;

		await mutateAsync(message);
	};

	const isDisabled = document?.status !== 'success' || isPending;

	return (
		<form onSubmit={onSubmit} className="flex-1">
			<InputGroup>
				<InputGroupTextarea
					disabled={isDisabled}
					name="search"
					placeholder="Search"
					onChange={(e) => setMessage(e.target.value)}
					value={message}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton disabled={isDisabled} type="reset">
						<CircleXIcon />
					</InputGroupButton>
				</InputGroupAddon>
				<InputGroupAddon align="inline-end">
					<InputGroupButton disabled={isDisabled} type="submit">
						<SendIcon />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</form>
	);
};

export default Message;
