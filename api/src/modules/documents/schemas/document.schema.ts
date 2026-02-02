import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { type Status, statuses } from '../../../shared/types/schemas.types';
import { DocumentChatMessageDocument } from '../../chat/schemas/message.schema';

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

DocumentSchema.pre(
	'deleteOne',
	{ document: false, query: true },
	async function () {
		const filter = this.getFilter();

		const doc = await this.model.findOne<DocumentDocument>(filter);
		if (!doc) return;

		const chatMessageModel =
			this.model.db.model<DocumentChatMessageDocument>(
				'DocumentChatMessage',
			);

		await chatMessageModel.deleteMany({ document: doc._id });
	},
);
