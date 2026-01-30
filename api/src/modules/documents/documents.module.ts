import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, DocumentSchema } from './schemas/document.schema';
import { S3Module } from '../s3/s3.module';
import { PineconeModule } from '../pinecone/pinecone.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Document.name, schema: DocumentSchema },
		]),
		S3Module,
		PineconeModule,
	],
	controllers: [DocumentsController],
	providers: [DocumentsService],
	exports: [DocumentsService],
})
export class DocumentsModule {}
