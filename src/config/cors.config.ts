import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export const corsConfigs = (
  configService: ConfigService,
  logger: Logger,
): CorsOptions => {
  const originUrlsEnv = configService.get<string>('CORS_ORIGIN_URLS', '');
  const exposedHeadersEnv = configService.get<string>(
    'CORS_EXPOSED_HEADERS',
    '',
  );
  const allowedHeadersEnv = configService.get<string>(
    'CORS_ALLOWED_HEADERS',
    '',
  );
  const origin = originUrlsEnv.split(',');
  const exposedHeaders = exposedHeadersEnv.split(',');
  const allowedHeaders = allowedHeadersEnv.split(',');
  const maxAge = parseInt(configService.get<string>('CORS_MAX_AGE', '300'));
  logger.log(`CORS origin => ${origin}`);
  logger.log(`CORS exposedHeaders => ${exposedHeaders}`);
  logger.log(`CORS allowedHeaders => ${allowedHeaders}`);
  logger.log(`CORS maxAge => ${maxAge}`);
  return { origin, allowedHeaders, exposedHeaders, maxAge };
};
