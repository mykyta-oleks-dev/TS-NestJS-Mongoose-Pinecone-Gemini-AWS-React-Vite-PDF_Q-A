import { Injectable } from '@nestjs/common';
import {
	Pinecone,
	RecordMetadata,
	RecordValues,
	ScoredPineconeRecord,
} from '@pinecone-database/pinecone';
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

	async query<
		T extends ScoredPineconeRecord<RecordMetadata> & {
			values: RecordValues;
		},
	>(
		indexName: string,
		namespace: string,
		queryEmbedding: RecordValues,

		topK = 5,
	) {
		const res = await this.client
			.index(indexName)
			.namespace(namespace)
			.query({
				vector: queryEmbedding,
				includeMetadata: true,
				topK,
			});

		const matches = (res.matches.filter((m) => m.values) as T[]).sort(
			(a, b) => (a.score && b.score ? b.score - a.score : 0),
		);

		return matches;
	}

	delete(indexName: string, namespace: string) {
		return this.client.index(indexName).namespace(namespace).deleteAll();
	}
}
