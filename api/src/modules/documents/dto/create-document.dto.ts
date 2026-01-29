import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDocumentDto {
	@IsNotEmpty()
	@IsUUID()
	tempUuid: string;

	@IsNotEmpty()
	@IsString()
	fileName: string;
}
