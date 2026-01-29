import { Controller } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UseUserEmailGuard } from '../../shared/guards/user-email.guard';

@Controller('documents')
@UseUserEmailGuard()
export class DocumentsController {
	constructor(private readonly documentsService: DocumentsService) {}
}
