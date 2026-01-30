import { Injectable } from '@nestjs/common';
import { Pinecone, RecordValues } from '@pinecone-database/pinecone';
import {
	PineconeConfig,
	TypedConfigService,
} from '../../shared/types/config-service.types';

@Injectable()
export class PineconeService {
	private readonly client: Pinecone;

	constructor(private readonly configService: TypedConfigService) {
		const pineconeConfig = configService.get<PineconeConfig>('pinecone');

		if (!pineconeConfig) {
			throw new Error('Pinecone configuration is missing');
		}

		this.client = new Pinecone({
			apiKey: pineconeConfig.apiKey,
		});
	}

	query(indexName: string, namespace: string, queryEmbedding: RecordValues) {
		return this.client.index(indexName).namespace(namespace).query({
			vector: queryEmbedding,
			includeMetadata: true,
			topK: 5,
		});
	}

	delete(indexName: string, namespace: string) {
		return this.client.index(indexName).namespace(namespace).deleteAll();
	}
}
