import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { extractText, getDocumentProxy } from 'unpdf';

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

export const handler = async (event: any) => {
	console.log('Incoming event:', JSON.stringify(event, null, 2));

	const bucket = event.detail.bucket.name;
	const key = event.detail.object.key;

	console.log(`Processing file: s3://${bucket}/${key}`);

	const response = await s3.send(
		new GetObjectCommand({ Bucket: bucket, Key: key }),
	);

	const buffer = await streamToBuffer(response.Body as Readable);

	const { text } = await extractPdf(buffer);

	console.log('File text:', text);

	return {
		bucket,
		key,
		status: 'TEXT_EXTRACTION_PLACEHOLDER',
	};
};
