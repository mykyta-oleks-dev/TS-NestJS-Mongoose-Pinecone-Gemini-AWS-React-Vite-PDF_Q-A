import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Status } from '../../../shared/types/schemas.types';

export interface DocumentStatusEvent {
	id: string;
	email: string;
	status: Status;
}

@Injectable()
export class DocumentsEventsService {
	private readonly subject: Subject<DocumentStatusEvent>;

	constructor() {
		this.subject = new Subject<DocumentStatusEvent>();
	}

	emit(event: DocumentStatusEvent) {
		this.subject.next(event);
	}

	asObservable() {
		return this.subject.asObservable();
	}
}
