import { IsNotEmpty, IsString } from 'class-validator';

export class SseQueryDto {
	@IsNotEmpty()
	@IsString()
	email: string;
}
