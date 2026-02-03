import { axiosInstance } from '@/config/axios';
import { API_URL } from '@/constants/env.constants';
import { parseDBMessage, type DBMessage } from '@/types/message.types';

export const CHAT_ROUTE = 'chat';
export const CHAT_URL = `${API_URL}/${CHAT_ROUTE}`;

export const getMessages = async () => {
	const res = await axiosInstance.get<DBMessage[]>(CHAT_ROUTE);

	return res.data.map((m) => parseDBMessage(m));
};

export const sendMessage = async (question: string) => {
	const res = await axiosInstance.post<DBMessage>(CHAT_ROUTE, {
		question,
	});

	return parseDBMessage(res.data);
};
