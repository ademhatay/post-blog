import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration, AppConfigService } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
