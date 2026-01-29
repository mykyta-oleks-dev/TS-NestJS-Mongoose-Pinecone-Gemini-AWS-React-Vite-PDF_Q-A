import { ConfigService } from '@nestjs/config';
import { AWSConfig } from '../config/aws.config';

export default interface ConfigType {
	aws: AWSConfig;
}

export default class TypedConfigService extends ConfigService<ConfigType> {}
