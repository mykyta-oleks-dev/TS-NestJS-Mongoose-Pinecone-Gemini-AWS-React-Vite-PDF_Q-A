import { axiosInstance } from '@/config/axios';
import { API_URL } from '@/constants/env.constants';
import { type Document } from '@/types/document.types';
import axios from 'axios';

export const DOCUMENTS_URL = `${API_URL}/documents`;

export const getDocument = async () => {
	const res = await axiosInstance.get<Document>(DOCUMENTS_URL);
	return res.data;
};

export const generatePresignedURL = async (
	contentType: string,
	size: number,
) => {
	const res = await axiosInstance.post<{
		url: string;
		uuid: string;
		key: string;
	}>(`${DOCUMENTS_URL}/presigned-url`, {
		contentType,
		size,
	});

	return res.data;
};

export const putDocument = (putUrl: string, file: File) =>
	axios.put(putUrl, file, {
		headers: {
			'Content-Type': file.type,
		},
	});

export const finalizeUpload = async (tempKey: string, fileName: string) => {
	const res = await axiosInstance.post<{ document: Document }>(
		DOCUMENTS_URL,
		{ tempKey, fileName },
	);

	return res.data.document;
};

export const deleteDocument = () => axiosInstance.delete(DOCUMENTS_URL);
