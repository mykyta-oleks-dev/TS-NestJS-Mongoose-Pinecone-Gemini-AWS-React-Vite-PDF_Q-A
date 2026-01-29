import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document } from './schemas/document.schema';
import { Model } from 'mongoose';

@Injectable()
export class DocumentsService {
	constructor(
		@InjectModel(Document.name)
		private readonly documentModel: Model<Document>,
	) {}
}
