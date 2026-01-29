import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from './modules/s3/s3.module';
import { ConfigModule } from '@nestjs/config';
import {
	appConfigOptions,
	TypedConfigModule,
} from './shared/config/app.config';

@Module({
	imports: [
		ConfigModule.forRoot(appConfigOptions),
		TypedConfigModule,
		S3Module,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
