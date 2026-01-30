import {
	CopyObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommand,
	NotFound as NotFoundS3,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { AWSConfig } from '../../shared/config/aws.config';
import { extensions } from '../../shared/constants/files.constants';
import { TypedConfigService } from '../../shared/types/config-service.types';
import { FilesContentType } from '../../shared/types/files.types';

@Injectable()
export class S3Service {
	private readonly client: S3Client;
	private readonly bucketName: string;

	constructor(private readonly configService: TypedConfigService) {
		const awsConfig = configService.get<AWSConfig>('aws');

		if (!awsConfig) {
			throw new Error('AWS configuration is missing');
		}

		this.client = new S3Client({
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

		return getSignedUrl(this.client, command, { expiresIn });
	}

	getTmpKey(uuid: UUID, contentType: FilesContentType) {
		return `tmp/${uuid}${extensions[contentType]}`;
	}

	async getFileHead(key: string) {
		return this.tryCatch(() =>
			this.client.send(
				new HeadObjectCommand({
					Bucket: this.bucketName,
					Key: key,
				}),
			),
		);
	}

	moveFile(destKey: string, sourceKey: string) {
		return this.tryCatch(async () => {
			const copyCommand = new CopyObjectCommand({
				Bucket: this.bucketName,
				Key: destKey,
				CopySource: `/${this.bucketName}/${sourceKey}`,
			});

			await this.client.send(copyCommand);

			const deleteCommand = new DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: sourceKey,
			});

			await this.client.send(deleteCommand);
		});
	}

	private async tryCatch<ReturnType>(
		cb: () => ReturnType | Promise<ReturnType>,
	) {
		try {
			return await cb();
		} catch (err: unknown) {
			if (err instanceof NotFoundS3) {
				throw new NotFoundException(
					'The file does not exist by specified parameters',
				);
			} else throw err;
		}
	}
}
