import {
  INestApplication,
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import * as semver from 'semver';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { HttpConfig } from 'src/config/http.config';
import { Logger } from 'src/logger/logger.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { setupSwagger } from './open-api.setup';
import { version } from '../../../../package.json';

export const config = async (app: INestApplication) => {
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Accept-Version',
    defaultVersion: [VERSION_NEUTRAL, `v${semver.major(version)}`],
  });
  setupSwagger(app);
};

async function bind(module) {
  const app = await NestFactory.create(module, { bufferLogs: true });
  await config(app);
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);
  const portConfig = configService.get<HttpConfig>('http');
  await app.listen(portConfig.httpPort);
  logger.log(`Server running on port ${portConfig.httpPort}`);
}

export default { bind };
