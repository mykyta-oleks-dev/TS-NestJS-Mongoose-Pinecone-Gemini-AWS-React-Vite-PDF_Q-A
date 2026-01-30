import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const statuses = ['pending', 'success', 'error'] as const;

export type Status = (typeof statuses)[number];

@Schema()
export class Document {
	@Prop({ required: true, unique: true })
	key: string;

	@Prop({ required: true })
	fileName: string;

	@Prop({ required: true, unique: true })
	userEmail: string;

	@Prop({ enum: statuses, required: true, default: 'pending' })
	status: Status;

	@Prop()
	vectorsCount?: number;
}

export type DocumentDocument = HydratedDocument<Document>;

export const DocumentSchema = SchemaFactory.createForClass(Document);
