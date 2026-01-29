import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
	appConfigOptions,
	TypedConfigModule,
} from './shared/config/app.config';

@Module({
	imports: [ConfigModule.forRoot(appConfigOptions), TypedConfigModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
