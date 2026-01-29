import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from './modules/s3/s3.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
	appConfigOptions,
	TypedConfigModule,
} from './shared/config/app.config';
import { TypedConfigService } from './shared/types/config-service.types';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './shared/config/mongoose.config';
import { Connection } from 'mongoose';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
	imports: [
		ConfigModule.forRoot(appConfigOptions),
		TypedConfigModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: TypedConfigService) => ({
				uri: configService.get<MongooseConfig>('mongoose')?.dbUri,
				onConnectionCreate: (connection: Connection) => {
					connection.on('connected', () =>
						console.log('Mongoose connected successfuly!'),
					);
				},
			}),
			inject: [ConfigService],
		}),
		S3Module,
		DocumentsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
