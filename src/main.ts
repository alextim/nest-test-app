import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import fs from 'node:fs';
import path from 'node:path';

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
    throw new Error('SSL cert required');
  }
  return {
    key: fs.readFileSync(path.join(__dirname, keyPath)),
    cert: fs.readFileSync(path.join(__dirname, certPath)),
  };
};

async function bootstrap() {
  const httpsOptions = getHttpsOptions();
  const app = await NestFactory.create(AppModule, { httpsOptions });

  const config = app.get(ConfigService);

  setup(app);
  setupSwagger(app, config);

  const port = config.get<number>('PORT');
  const host = config.get<string>('HOST');

  await app.listen(port, host, undefined);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error('Fatal error during initialization:', err);
  process.exit(1);
});
