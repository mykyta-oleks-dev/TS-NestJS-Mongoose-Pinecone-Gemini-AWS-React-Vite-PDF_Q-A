import { registerAs } from '@nestjs/config';
import { MongooseConfig } from '../types/config-service.types';

const mongooseConfig = registerAs(
	'mongoose',
	(): MongooseConfig => ({
		dbUri: process.env.MONGODB_URL,
	}),
);

export default mongooseConfig;
