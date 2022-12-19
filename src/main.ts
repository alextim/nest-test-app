import fs from 'node:fs';
import path from 'node:path';

import { Logger as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import { setup } from './setup';
import { setupSwagger } from './setup-swagger';

const getHttpsOptions = () => {
  if (process.env.SSL !== 'true') {
    return undefined;
  }
  const keyPath = process.env.SSL_KEY_PATH || '';
  const certPath = process.env.SSL_CERT_PATH || '';
  if (!keyPath || !certPath) {
    throw new Error('SSL cert/key required');
  }
  return {
    key: fs.readFileSync(path.join(__dirname, keyPath)),
    cert: fs.readFileSync(path.join(__dirname, certPath)),
  };
};

async function bootstrap() {
  const httpsOptions = getHttpsOptions();
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  setup(app);

  const config = app.get(ConfigService);
  
  setupSwagger(app);

  const port = config.get<number>('PORT');
  const host = config.get<string>('HOST');

  await app.listen(port, host, undefined);
  NestLogger.log(
    `Application is running on ${await app.getUrl()} in environment ${config.get<string>(
      'NODE_ENV',
    )}`,
  );
}

bootstrap().catch((err) => {
  NestLogger.error('Fatal error during initialization:', err);
  process.exit(1);
});
