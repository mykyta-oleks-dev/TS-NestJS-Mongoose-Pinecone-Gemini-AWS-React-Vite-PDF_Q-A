import { IsIn, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import {
	type FilesContentType,
	contentTypes,
} from '../../../shared/types/files.types';

export class GeneratePresignedUrlDto {
	@IsNotEmpty()
	@IsNumber()
	size: number;

	@IsNotEmpty()
	@MaxLength(100)
	@IsIn(contentTypes)
	contentType: FilesContentType;
}
