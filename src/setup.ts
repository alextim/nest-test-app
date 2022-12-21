import { HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { useContainer } from 'class-validator';

import passport from 'passport';
import session from 'express-session';

import { AppModule } from './app.module';

import { QueryErrorFilter } from './filters/query-error.filter';
import { validatorConfig } from './lib/config/configs/validator.config';
import { getSessionOptions } from './lib/config/configs/session.config';

export function setup(app: NestExpressApplication) {
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1', { exclude: ['/'] });

  app.disable('x-powered-by');
  app.disable('X-Powered-By');

  // QueryErrorFilter - catches any unique constraint violation exceptions during database create/update operations
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new QueryErrorFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      ...validatorConfig,
      transform: true,
    }),
  );

  app.use(session(getSessionOptions(configService)));

  app.use(passport.initialize());
  app.use(passport.session());

  // setupSwagger(app, config);

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/) ?? '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  // app.enableShutdownHooks();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}
