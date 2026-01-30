import { registerAs } from '@nestjs/config';
import { PineconeConfig } from '../types/config-service.types';

const pineconeConfig = registerAs(
	'pinecone',
	(): PineconeConfig => ({
		apiKey: process.env.PINECONE_API_KEY ?? '',
		documentsIndex: process.env.PINECONE_DOCS_INDEX ?? '',
	}),
);

export default pineconeConfig;
