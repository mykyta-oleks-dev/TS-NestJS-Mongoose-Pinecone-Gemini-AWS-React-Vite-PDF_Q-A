import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UseUserEmailGuard } from '../../shared/guards/user-email.guard';
import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';
import { UserEmail } from '../../shared/decorators/user-email.decorator';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
@UseUserEmailGuard()
export class DocumentsController {
	constructor(private readonly documentsService: DocumentsService) {}

	@Post('presigned-url')
	generatePutPresignedUrl(
		@Body() body: GeneratePresignedUrlDto,
		@UserEmail() email: string,
	) {
		return this.documentsService.generatePutPresignedUrl(body, email);
	}

	@Post()
	finalizeUpload(
		@Body() body: CreateDocumentDto,
		@UserEmail() email: string,
	) {
		return this.documentsService.finalizeUpload(body, email);
	}

	@Get()
	getCurrentDocument(@UserEmail() email: string) {
		return this.documentsService.getCurrentDocument(email);
	}

	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteCurrentDocument(@UserEmail() email: string) {
		return this.documentsService.deleteCurrentDocument(email);
	}
}
