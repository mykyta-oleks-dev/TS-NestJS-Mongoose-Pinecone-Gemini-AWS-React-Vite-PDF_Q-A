import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from '@/components/ui/input-group';
import { useUploadedFileStore } from '@/store/uploaded.store';
import { CircleXIcon, SendIcon } from 'lucide-react';

const Message = () => {
	const document = useUploadedFileStore((s) => s.document);

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
