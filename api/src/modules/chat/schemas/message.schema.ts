import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types, HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, collection: 'document_chat_messages' })
export class DocumentChatMessage {
	@Prop({
		type: MongooseSchema.Types.ObjectId,
		ref: 'Document',
		required: true,
	})
	document: Types.ObjectId;

	@Prop({ required: true })
	question: string;

	@Prop({ required: true })
	answer: string;
}

export type DocumentChatMessageDocument = HydratedDocument<DocumentChatMessage>;

export const DocumentChatMessageSchema =
	SchemaFactory.createForClass(DocumentChatMessage);
