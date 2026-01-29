import { registerAs } from '@nestjs/config';

export interface AWSConfig {
	region: string;
	bucketName: string;
	accessKeyId: string;
	secretAccessKey: string;
}

const awsConfig = registerAs(
	'aws',
	(): AWSConfig => ({
		region: process.env.AWS_REGION ?? 'us-east-1',
		bucketName: process.env.AWS_S3_BUCKET ?? 'default-bucket',
		accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
	}),
);

export default awsConfig;
