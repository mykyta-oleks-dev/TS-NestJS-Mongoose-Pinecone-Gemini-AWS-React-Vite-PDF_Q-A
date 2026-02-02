import { IsNotEmpty, IsString } from 'class-validator';

export class AskOnDocumentDto {
	@IsNotEmpty()
	@IsString()
	question: string;
}
