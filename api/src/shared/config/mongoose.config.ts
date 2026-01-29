import { registerAs } from '@nestjs/config';

export interface MongooseConfig {
	dbUri?: string;
}

const mongooseConfig = registerAs(
	'mongoose',
	(): MongooseConfig => ({
		dbUri: process.env.MONGODB_URL,
	}),
);

export default mongooseConfig;
