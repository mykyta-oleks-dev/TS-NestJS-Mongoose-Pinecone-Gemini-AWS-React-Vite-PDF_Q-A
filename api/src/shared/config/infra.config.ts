import { registerAs } from '@nestjs/config';
import { InfraConfig } from '../types/config-service.types';

const infraConfig = registerAs(
	'infra',
	(): InfraConfig => ({
		hmacSecret: process.env.HMAC_SECRET ?? '',
	}),
);

export default infraConfig;
