import {
	BadRequestException,
	ConflictException,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from './schemas/document.schema';
import { Model } from 'mongoose';
import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';
import { S3Service } from '../s3/s3.service';
import { randomUUID } from 'node:crypto';
import { MAX_FILE_SIZE } from '../../shared/constants/document.constants';

@Injectable()
export class DocumentsService {
	constructor(
		@InjectModel(Document.name)
		private readonly documentModel: Model<Document>,
		private readonly s3: S3Service,
	) {}

	async generatePutPresignedUrl(
		body: GeneratePresignedUrlDto,
		email: string,
	) {
		await this.assertNoActiveDocument(email);

		if (body.size > MAX_FILE_SIZE) {
			throw new BadRequestException('File size must be less than 10MB');
		}

		const uuid = randomUUID();

		const tmpKey = this.s3.getTmpKey(uuid, body.contentType);

		const url = await this.s3.generatePutPresignedUrl(
			tmpKey,
			body.contentType,
			body.size,
		);

		return { url, uuid };
	}

	getCurrentDocument(userEmail: string) {
		return this.documentModel.findOne({ userEmail });
	}

	async assertNoActiveDocument(userEmail: string) {
		const existing = await this.getCurrentDocument(userEmail);

		if (existing) {
			throw new ConflictException('User already has document uploaded');
		}
	}
}
