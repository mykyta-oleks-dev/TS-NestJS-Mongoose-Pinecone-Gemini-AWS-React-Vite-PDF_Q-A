import BottomBar from './bottom-bar';
import ChatBox from './chat-box';

const ChatPage = () => {
	return (
		<div className="w-full h-full flex flex-col gap-2">
			<ChatBox />
			<BottomBar />
		</div>
	);
};

export default ChatPage;
