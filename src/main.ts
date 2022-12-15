import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setup } from './setup';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
