import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DocumentsModule } from '../documents/documents.module';
import { PineconeModule } from '../pinecone/pinecone.module';
import { GeminiModule } from '../gemini/gemini.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
	DocumentChatMessage,
	DocumentChatMessageSchema,
} from './schemas/message.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: DocumentChatMessage.name,
				schema: DocumentChatMessageSchema,
			},
		]),
		DocumentsModule,
		PineconeModule,
		GeminiModule,
	],
	controllers: [ChatController],
	providers: [ChatService],
})
export class ChatModule {}
