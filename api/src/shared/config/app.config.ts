import {
	ConfigModuleOptions,
	ConfigModule,
	ConfigService,
} from '@nestjs/config';
import Joi from 'joi';
import awsConfig from './aws.config';
import { Global, Module } from '@nestjs/common';
import TypedConfigService from '../types/config-service.types';

export const appConfigSchema = Joi.object({
	AWS_REGION: Joi.string().required(),
	AWS_S3_BUCKET: Joi.string().required(),
	AWS_ACCESS_KEY_ID: Joi.string().required(),
	AWS_SECRET_ACCESS_KEY: Joi.string().required(),
});

export const appConfigOptions: ConfigModuleOptions = {
	isGlobal: true,
	load: [awsConfig],
	validationSchema: appConfigSchema,
	validationOptions: {
		allowUnknown: true,
		abortEarly: true,
	},
};

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: TypedConfigService,
			useExisting: ConfigService,
		},
	],
	exports: [TypedConfigService],
})
export class TypedConfigModule {}
