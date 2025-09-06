import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AppConfigService } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(AppConfigService);

  app.enableCors({
    origin: configService.cors.origin,
    credentials: true,
  });

  const port = configService.port;
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
  console.log(`${configService.nodeEnv}`);
}
bootstrap();
