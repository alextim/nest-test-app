import path from 'node:path';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Logger as NestLogger } from '@nestjs/common';

import { EnvironmentVariables } from './EnvironmentVariables';

const getTypeormLogging = (s: string | undefined) => {
  if (!s) {
    return undefined;
  }
  if (s === 'true') {
    return true;
  }
  if (s.includes(',')) {
    return s.split(',');
  }
  return s;
};

export function validate(config: Record<string, unknown>) {
  const env = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(env, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString() + '\n  config:' + config.toString() + '\n env:' + env.toString() + '\n ' + (process.env.APP_NAME || 'undef'));
  }

  const isSSL = env.SSL === 'true';

  const host = env.HOST;
  const port = env.PORT;

  let baseUrl = `http${isSSL ? 's' : ''}://`;
  if (env.APP_PATH_BASE) {
    baseUrl += env.APP_PATH_BASE;
  } else {
    baseUrl += host + (port ? `:${port}` : '');
  }

  const n = env.UPLOADS_DIR.indexOf(env.PUBLIC_DIR);
  const uploadsUrl = env.UPLOADS_DIR.substring(n + env.PUBLIC_DIR.length);

  const frontendAppUrl = env.FRONTEND_APP_URL || baseUrl;
  const appConfig = {
    NODE_ENV: env.NODE_ENV,

    isProd: env.NODE_ENV === 'production',
    isStaging: env.NODE_ENV === 'staging',
    isDev: env.NODE_ENV === 'development',
    isTest: env.NODE_ENV === 'test',

    appName: env.APP_NAME,

    baseUrl,
    urlPrefix: env.URL_PREFIX,

    frontendAppUrl,

    redirectAfterVerification: env.REDIRECT_AFTER_VERIFICATION,
    redirectUrlAfterVerification: env.REDIRECT_URL_AFTER_VERIFICATION
      ? `${frontendAppUrl}${env.REDIRECT_URL_AFTER_VERIFICATION}`
      : frontendAppUrl,

    server: {
      host,
      port,

      publicDir: path.join(__dirname, env.PUBLIC_DIR),
    },

    uploads: {
      dir: path.join(__dirname, env.UPLOADS_DIR),
      baseUrl: uploadsUrl,
      maxFileSize: env.UPLOADS_MAX_FILE_SIZE,
    },

    log: {
      level: env.LOG_LEVEL,
      toFile: env.LOG_TO_FILE,
      dir: env.LOG_DIR,
      fileName: env.LOG_FILENAME,
    },

    session: {
      secret: env.SESSION_SECRET,
      cookieName: env.SESSION_COOKIE_NAME || 'connect.sid',
      cookieDomain: env.SESSION_COOKIE_DOMAIN || undefined,
    },

    cors: {
      allowedOrigins: env.CORS_ALLOWED_ORIGINS
        ? env.CORS_ALLOWED_ORIGINS.split(/\s*,\s*/)
        : '*',
    },

    databaseUrl: env.DATABASE_URL,

    typeorm: {
      // advanced-console, simple-console, file, debug
      logger: env.TYPEORM_LOGGER,
      // true, all, [query, error, schema, warn, info, log]
      logging: getTypeormLogging(env.TYPEORM_LOGGING),
      // log all queries which run more then `maxQueryExecutionTime`
      maxQueryExecutionTime: env.TYPEORM_MAX_QUERY_EXECUTION_TIME,
    },

    mail: {
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      username: env.MAIL_USERNAME,
      password: env.MAIL_PASSWORD,
      fromName: env.MAIL_FROM_NAME,
      fromEmail: env.MAIL_FROM_EMAIL,
    },

    auth: {
      passwordRecoveryTokenTTL: env.PASSWORD_RESET_TOKEN_TTL,
      emailVerificationTokenTTL: env.EMAIL_VERIFICATION_TOKEN_TTL,
      google: {
        clientId: env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
      },
      facebook: {
        appId: env.FACEBOOK_APP_ID,
        appSecret: env.FACEBOOK_APP_SECRET,
      },
    },

    ssl: isSSL
      ? {
          keyPath: path.join(__dirname, env.SSL_KEY_PATH),
          certPath: path.join(__dirname, env.SSL_CERT_PATH),
        }
      : undefined,
  };

  NestLogger.debug('appConfig:', appConfig);

  return appConfig;
}
