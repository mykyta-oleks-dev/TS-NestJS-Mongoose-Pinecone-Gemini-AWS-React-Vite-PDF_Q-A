import { useDocumentsEvents } from '@/hooks/documents/useDocumentsEvents';
import BottomBar from './bottom-bar';
import ChatBox from './chat-box';

const ChatPage = ({ email }: { email: string }) => {
	useDocumentsEvents(email);

	return (
		<div className="w-full h-full flex flex-col gap-2">
			<ChatBox />
			<BottomBar />
		</div>
	);
};

export default ChatPage;
