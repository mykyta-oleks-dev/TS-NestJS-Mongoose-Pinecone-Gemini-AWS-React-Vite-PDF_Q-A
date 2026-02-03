import type { AppMessage } from '@/types/message.types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBox = ({ message }: { message: AppMessage }) => {
	return (
		<div className="flex flex-col p-2 bg-gray-700 rounded-md">
			<p className="text-right mb-3 bg-gray-800 py-1 px-2 rounded-md">
				{message.question}
			</p>
			<div className="mb-1 bg-gray-900 py-1 px-2 rounded-md answer max-w-full!">
				{message.answer ? (
					<Markdown remarkPlugins={[remarkGfm]}>
						{message.answer}
					</Markdown>
				) : (
					<>Please wait...</>
				)}
			</div>
			<span className="text-sm text-gray-400">
				{message.createdAt.toLocaleString('en-us', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
				})}
			</span>
		</div>
	);
};

export default MessageBox;
