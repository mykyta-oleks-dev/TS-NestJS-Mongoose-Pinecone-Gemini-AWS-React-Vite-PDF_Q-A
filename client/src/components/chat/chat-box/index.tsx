import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBox from './message';
import { useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/chat-messages/useMessages';
import { toast } from 'sonner';
import { useCurrentDocument } from '@/hooks/documents/useCurrentDocument';

const ChatBox = () => {
	const { data: document } = useCurrentDocument();
	const { data: messages, error, isLoading } = useMessages(document);
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const scrollArea = scrollAreaRef.current?.querySelector(
			'[data-radix-scroll-area-viewport]',
		);

		if (scrollArea) {
			scrollArea.scrollTop = scrollArea.scrollHeight;
		}
	}, [messages]);

	const haveMessages = !isLoading && !!messages?.length;

	if (error) {
		toast.error(`Error fetching chat messages: ${error.message}`);
	}

	return (
		<ScrollArea
			ref={scrollAreaRef}
			type="always"
			className="p-3 rounded-md text-gray-200 bg-gray-600 flex-1 overflow-x-auto scroll-auto"
		>
			<div className="flex flex-col gap-2">
				{!haveMessages && (
					<h4 className="m-auto text-xl">
						{isLoading
							? 'Loading'
							: document
								? 'No messages sent to Chat Bot yet.'
								: 'Upload document to start'}
					</h4>
				)}
				{haveMessages &&
					messages.map((m) => <MessageBox message={m} key={m._id} />)}
			</div>
		</ScrollArea>
	);
};

export default ChatBox;
