interface IMessage {
	_id: string;
	document: string;
	question: string;
	answer?: string;
}

export interface AppMessage extends IMessage {
	createdAt: Date;
}

export interface DBMessage extends IMessage {
	createdAt: string;
}

export const parseDBMessage = (dbMessage: DBMessage): AppMessage => ({
	...dbMessage,
	createdAt: new Date(dbMessage.createdAt),
});

export const parseAppMessage = (message: AppMessage): DBMessage => ({
	...message,
	createdAt: message.createdAt.toISOString(),
});
