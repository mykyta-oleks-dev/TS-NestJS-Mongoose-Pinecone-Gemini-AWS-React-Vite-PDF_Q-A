import { ConfigService } from '@nestjs/config';

export interface AWSConfig {
	region: string;
	bucketName: string;
	accessKeyId: string;
	secretAccessKey: string;
}

export interface MongooseConfig {
	dbUri?: string;
}

export interface InfraConfig {
	hmacSecret: string;
}

export interface PineconeConfig {
	apiKey: string;

	documentsIndex: string;
}

export interface ConfigType {
	aws: AWSConfig;
	mongoose: MongooseConfig;
	infra: InfraConfig;
	pinecone: PineconeConfig;
}

export class TypedConfigService extends ConfigService<ConfigType> {}
