import { Body, Controller, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UseUserEmailGuard } from '../../shared/guards/user-email.guard';
import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';
import { UserEmail } from '../../shared/decorators/user-email.decorator';

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
}
