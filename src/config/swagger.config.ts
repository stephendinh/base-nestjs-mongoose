import { Environments } from '@common/constants/environments.constant';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfigs = (
  app: NestFastifyApplication,
  configService: ConfigService,
  logger: Logger,
): void => {
  const environment = configService.get<string>('ENVIRONMENT');
  if (environment !== Environments.PRODUCTION) {
    const config = new DocumentBuilder()
      .setTitle('Api document')
      .setDescription('This is a nestjs base with mongoose')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    logger.log('Swagger is available at { /api }');
  }
};
