import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AskOnDocumentDto } from './dto/ask-on-document.dto';
import { UserEmail } from '../../shared/decorators/user-email.decorator';
import { UseUserEmailGuard } from '../../shared/guards/user-email.guard';

@Controller('chat')
@UseUserEmailGuard()
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Post()
	askOnDocument(@Body() body: AskOnDocumentDto, @UserEmail() email: string) {
		return this.chatService.askOnDocument(email, body.question);
	}

	@Get()
	getCurrentDocumentChat(@UserEmail() email: string) {
		return this.chatService.getMessages(email);
	}
}
