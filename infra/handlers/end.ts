import crypto from 'node:crypto';
import { EndStateInput } from '../shared/types/end.types';

function signRequest(body: unknown, timestamp: string, secret: string) {
	const payload = `${timestamp}.${JSON.stringify(body)}`;
	return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export const handler = async (event: EndStateInput) => {
	const hmacSecret = process.env.HMAC_SECRET;
	const apiUrl = process.env.API_URL;

	if (!hmacSecret) {
		throw new Error('HMAC Secret environment variable is not set');
	}

	const key =
		'key' in event ? event.key : (event.detail.object.key as string);

	const { error: errorRaw, vectorsCount } = event;
	const error =
		typeof errorRaw === 'string' ? JSON.parse(errorRaw) : errorRaw;

	const success = !error;

	const body = { key, success, error, vectorsCount };

	if (!apiUrl) return body;

	const timestamp = Date.now().toString();
	const signature = signRequest(body, timestamp, hmacSecret);

	await fetch(`${apiUrl}/documents/status`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'X-Signature': signature,
			'X-Timestamp': timestamp,
		},
		body: JSON.stringify(body),
	});

	return body;
};
