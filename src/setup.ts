import { HttpAdapterHost } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { useContainer } from 'class-validator';

import passport from 'passport';
import session from 'express-session';

import { AppModule } from './app.module';

import { QueryErrorFilter } from './filters/query-error.filter';
import { getSessionOptions } from './config/session.config';

export function setup(app: INestApplication) {
  app.setGlobalPrefix('api/v1', { exclude: ['/'] });

  const { httpAdapter } = app.get(HttpAdapterHost);
  // QueryErrorFilter - catches any unique constraint violation exceptions during database create/update operations
  app.useGlobalFilters(new QueryErrorFilter(httpAdapter));

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      enableDebugMessages: true,
      validationError: {
        target: true,
        value: true,
      },
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
