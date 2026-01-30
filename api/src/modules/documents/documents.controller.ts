import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UseUserEmailGuard } from '../../shared/guards/user-email.guard';
import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';
import { UserEmail } from '../../shared/decorators/user-email.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UseInternalHmacGuard } from '../../shared/guards/hmac-signed.guard';
import { UpdateStatusDto, UpdateStatusPayload } from './dto/update-status.dto';

@Controller('documents')
export class DocumentsController {
	constructor(private readonly documentsService: DocumentsService) {}

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
		const payload = body as UpdateStatusPayload;
		console.log(payload);

		return payload;
	}
}
