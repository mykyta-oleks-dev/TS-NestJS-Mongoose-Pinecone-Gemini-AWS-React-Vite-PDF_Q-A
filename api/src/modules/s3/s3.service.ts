import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { AWSConfig } from '../../shared/config/aws.config';
import { extensions } from '../../shared/constants/document.constants';
import { TypedConfigService } from '../../shared/types/config-service.types';
import { FilesContentType } from '../../shared/types/files.types';

@Injectable()
export class S3Service {
	private readonly s3: S3Client;
	private readonly bucketName: string;

	constructor(private readonly configService: TypedConfigService) {
		const awsConfig = configService.get<AWSConfig>('aws');

		if (!awsConfig) {
			throw new Error('AWS configuration is missing');
		}

		this.s3 = new S3Client({
			region: awsConfig.region,
			credentials: {
				accessKeyId: awsConfig.accessKeyId,
				secretAccessKey: awsConfig.secretAccessKey,
			},
		});

		this.bucketName = awsConfig.bucketName;
	}

	generatePutPresignedUrl(
		key: string,
		contentType: FilesContentType,
		size: number,
		expiresIn = 60,
	) {
		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			ContentType: contentType,
			Key: key,
			ContentLength: size,
		});

		return getSignedUrl(this.s3, command, { expiresIn });
	}

	getTmpKey(uuid: UUID, contentType: FilesContentType) {
		return `tmp/${uuid}${extensions[contentType]}`;
	}
}
