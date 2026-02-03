import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Query,
	Sse,
} from '@nestjs/common';
import { filter, map } from 'rxjs';
import { UserEmail } from '../../shared/decorators/user-email.decorator';
import { UseInternalHmacGuard } from '../../shared/guards/hmac-signed.guard';
import { UseUserEmailGuard } from '../../shared/guards/user-email.guard';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { DocumentsEventsService } from './services/documents-events.service';
import { SseQueryDto } from './dto/sse.query.dto';

@Controller('documents')
export class DocumentsController {
	constructor(
		private readonly documentsService: DocumentsService,
		private readonly events: DocumentsEventsService,
	) {}

	@Post('presigned-url')
	@UseUserEmailGuard()
	generatePutPresignedUrl(
		@Body() body: GeneratePresignedUrlDto,
		@UserEmail() email: string,
	) {
		return this.documentsService.generatePutPresignedUrl(body, email);
	}

	@Post()
	@UseUserEmailGuard()
	finalizeUpload(
		@Body() body: CreateDocumentDto,
		@UserEmail() email: string,
	) {
		return this.documentsService.finalizeUpload(body, email);
	}

	@Get()
	@UseUserEmailGuard()
	getCurrentDocument(@UserEmail() email: string) {
		return this.documentsService.getCurrentDocument(email);
	}

	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseUserEmailGuard()
	deleteCurrentDocument(@UserEmail() email: string) {
		return this.documentsService.deleteCurrentDocument(email);
	}

	@Patch('status')
	@UseInternalHmacGuard()
	internalUpdateStatus(@Body() body: UpdateStatusDto) {
		return this.documentsService.updateStatus(body);
	}

	@Sse('events')
	public documentsEvents(@Query() { email }: SseQueryDto) {
		return this.events.asObservable().pipe(
			filter((e) => e.email === email),
			map((event) => ({
				data: event,
			})),
		);
	}
}
