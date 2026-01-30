import {
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateIf,
} from 'class-validator';

export class UpdateStatusDto {
	@IsNotEmpty()
	@IsString()
	key: string;

	@IsBoolean()
	success: boolean;

	// Only required if success === false
	@ValidateIf((o: { success: boolean }) => o.success === false)
	@IsObject()
	@IsOptional()
	error?: object;

	// Only required if success === true
	@ValidateIf((o: { success: boolean }) => o.success === true)
	@IsNumber()
	@IsOptional()
	vectorsCount?: number;
}

export type UpdateStatusPayload =
	| {
			key: string;
			success: true;
			vectorsCount: number;
	  }
	| {
			key: string;
			success: false;
			error?: object;
	  };
