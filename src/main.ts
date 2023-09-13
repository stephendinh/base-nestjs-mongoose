import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { corsConfigs } from '@config/cors.config';
import { swaggerConfigs } from '@config/swagger.config';
import { nestFastifyAppConfig } from '@config/nest-fastify-app.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.enableCors(corsConfigs(configService, logger));
  nestFastifyAppConfig(app);
  swaggerConfigs(app, configService, logger);

  const port = configService.get<number>('PORT');
  await app.listen(port, '0.0.0.0');
  logger.log(`App is running on port: ${port}`);
}
bootstrap();
