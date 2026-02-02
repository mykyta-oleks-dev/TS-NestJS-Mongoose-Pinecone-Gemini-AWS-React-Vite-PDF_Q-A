import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, DocumentSchema } from './schemas/document.schema';
import { S3Module } from '../s3/s3.module';
import { PineconeModule } from '../pinecone/pinecone.module';
import { DocumentsEventsService } from './services/documents-events.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Document.name, schema: DocumentSchema },
		]),
		S3Module,
		PineconeModule,
	],
	controllers: [DocumentsController],
	providers: [DocumentsService, DocumentsEventsService],
	exports: [DocumentsService],
})
export class DocumentsModule {}
