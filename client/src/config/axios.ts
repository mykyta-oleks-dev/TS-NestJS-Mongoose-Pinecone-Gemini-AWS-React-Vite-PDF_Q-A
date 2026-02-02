import { API_URL } from '@/constants/env.constants';
import { useEmailStore } from '@/store/email.store';
import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use((config) => {
	const email = useEmailStore.getState().email;

	if (email) {
		config.headers['X-User-Email'] = email;
	}

	return config;
});
