import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from './modules/s3/s3.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
	appConfigOptions,
	TypedConfigModule,
} from './shared/config/app.config';
import {
	TypedConfigService,
	MongooseConfig,
} from './shared/types/config-service.types';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DocumentsModule } from './modules/documents/documents.module';
import { UserEmailMiddleware } from './shared/middlewares/user-email.middleware';
import { PineconeModule } from './modules/pinecone/pinecone.module';
import { GeminiModule } from './modules/gemini/gemini.module';
import { ChatModule } from './modules/chat/chat.module';

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
		ChatModule,
		PineconeModule,
		GeminiModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(UserEmailMiddleware).forRoutes('*');
	}
}
