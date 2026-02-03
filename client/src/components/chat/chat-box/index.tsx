import { ScrollArea } from '@/components/ui/scroll-area';
import type { AppMessage } from '@/types/message.types';
import MessageBox from './message';
import { useEffect, useRef } from 'react';

// const messages: AppMessage[] = [];
const messages: AppMessage[] = [
	{
		_id: '1',
		createdAt: new Date(),
		document: '1',
		question: 'boo?',
	},
	{
		_id: '2',
		createdAt: new Date(),
		document: '2',
		question: 'boo?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto at quam debitis rem aliquam ea aperiam harum voluptate voluptatum, perspiciatis quas temporibus. Asperiores velit eaque consequuntur illum, eum laborum. Nihil?',
	},
	{
		_id: '3',
		createdAt: new Date(),
		document: '3',
		question: 'boo?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto at quam debitis rem aliquam ea aperiam harum voluptate voluptatum, perspiciatis quas temporibus. Asperiores velit eaque consequuntur illum, eum laborum. Nihil?',
	},
	{
		_id: '4',
		createdAt: new Date(),
		document: '4',
		question: 'boo?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto at quam debitis rem aliquam ea aperiam harum voluptate voluptatum, perspiciatis quas temporibus. Asperiores velit eaque consequuntur illum, eum laborum. Nihil?',
	},
	{
		_id: '5',
		createdAt: new Date(),
		document: '5',
		question: 'boo?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto at quam debitis rem aliquam ea aperiam harum voluptate voluptatum, perspiciatis quas temporibus. Asperiores velit eaque consequuntur illum, eum laborum. Nihil?',
	},
	{
		_id: '6',
		createdAt: new Date(),
		document: '6',
		question: 'boo?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto at quam debitis rem aliquam ea aperiam harum voluptate voluptatum, perspiciatis quas temporibus. Asperiores velit eaque consequuntur illum, eum laborum. Nihil?',
	},
	{
		_id: '7',
		createdAt: new Date(),
		document: '7',
		question: 'boo?',
		answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto at quam debitis rem aliquam ea aperiam harum voluptate voluptatum, perspiciatis quas temporibus. Asperiores velit eaque consequuntur illum, eum laborum. Nihil?',
	},
];

const ChatBox = () => {
	const scrollAreaRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const scrollArea = scrollAreaRef.current?.querySelector(
			'[data-radix-scroll-area-viewport]',
		);

		if (scrollArea) {
			scrollArea.scrollTop = scrollArea.scrollHeight;
		}
	}, [messages]);

	return (
		<ScrollArea
			ref={scrollAreaRef}
			type="always"
			className="p-3 rounded-md text-gray-200 bg-gray-600 flex-1 overflow-x-auto scroll-auto"
		>
			<div className="flex flex-col gap-2">
				{!messages?.length && (
					<h4 className="m-auto text-xl">
						No messages sent to Chat Bot yet.
					</h4>
				)}
				{messages &&
					messages.length > 0 &&
					messages.map((m) => <MessageBox message={m} key={m._id} />)}
			</div>
		</ScrollArea>
	);
};

export default ChatBox;
