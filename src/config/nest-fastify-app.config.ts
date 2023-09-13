import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export const nestFastifyAppConfig = (app: NestFastifyApplication): void => {
  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Interceptors
  app.useGlobalInterceptors(new ExceptionInterceptor());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
};
