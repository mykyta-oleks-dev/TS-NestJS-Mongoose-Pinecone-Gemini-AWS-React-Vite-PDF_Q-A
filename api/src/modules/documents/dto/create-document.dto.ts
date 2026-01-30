import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
	@IsNotEmpty()
	@IsString()
	tempKey: string;

	@IsNotEmpty()
	@IsString()
	fileName: string;
}
