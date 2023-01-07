import { HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { useContainer } from 'class-validator';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import passport from 'passport';
import session from 'express-session';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';

import { QueryErrorFilter } from './filters/query-error.filter';
import { validatorConfig } from './lib/config/configs/validator.config';
import { getSessionOptions } from './lib/config/configs/session.config';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';

export function setup(app: NestExpressApplication) {
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      imgSrc: ["'self'", 'data:', 'blob:'],
    },
  }));
  
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  Sentry.init({
    dsn: 'https://b2b38becc1d34313a51fd11318ce0f75@o370170.ingest.sentry.io/4504374259744768',

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // filters
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  

  app.setGlobalPrefix(configService.get<string>('urlPrefix'), {
    exclude: ['/'],
  });

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
  app.set('trust proxy', 1);

  app.use(session(getSessionOptions(configService)));

  app.use(passport.initialize());
  app.use(passport.session());

  // setupSwagger(app, config);

  app.enableCors({
    origin: configService.get('cors.allowedOrigins'),
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTION'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    // exposedHeaders: ['Authorization'],
  });

  // app.enableShutdownHooks();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}
