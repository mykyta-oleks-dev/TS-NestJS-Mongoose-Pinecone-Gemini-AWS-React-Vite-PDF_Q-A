import { ConfigService } from '@nestjs/config';
import { AWSConfig } from '../config/aws.config';
import { MongooseConfig } from '../config/mongoose.config';

export interface ConfigType {
	aws: AWSConfig;
	mongoose: MongooseConfig;
}

export class TypedConfigService extends ConfigService<ConfigType> {}
