import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { extractText, getDocumentProxy } from 'unpdf';
import { ExtractReturn } from '../shared/types/extract.types';

const s3 = new S3Client({});

const streamToBuffer = async (stream: Readable) => {
	const chunks: Buffer[] = [];
	for await (const chunk of stream) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}
	return Buffer.concat(chunks);
};

const extractPdf = async (buffer: Buffer) => {
	const uint8Array = new Uint8Array(buffer);
	const pdf = await getDocumentProxy(uint8Array);

	const { totalPages, text } = await extractText(pdf, { mergePages: true });

	return { totalPages, text };
};

export const handler = async (input: any): Promise<ExtractReturn> => {
	const bucket = input.detail.bucket.name as string;
	const key = input.detail.object.key;

	if (!key || typeof key !== 'string') {
		throw new Error(
			'The key has to be a string path to the S3 object in the bucket',
		);
	}

	const lastSlashIdx = key.lastIndexOf('/');

	if (lastSlashIdx === -1) {
		throw new Error('The key has to have a user prefix.');
	}

	const prefix = key.substring(0, lastSlashIdx);
	const fileName = key.substring(lastSlashIdx + 1);

	const response = await s3.send(
		new GetObjectCommand({ Bucket: bucket, Key: key }),
	);

	const buffer = await streamToBuffer(response.Body as Readable);

	const { text } = await extractPdf(buffer);

	return {
		bucket,
		key,
		prefix,
		fileName,
		text,
	};
};
