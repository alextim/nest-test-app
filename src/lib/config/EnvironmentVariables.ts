import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsString,
  IsPositive,
  ValidateIf,
  IsIn,
  IsFQDN,
  Matches,
} from 'class-validator';

export enum Environment {
  Dev = 'development',
  Prod = 'production',
  Staging = 'staging',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = process.env.NODE_ENV as Environment;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string = process.env.APP_NAME;

  @IsString()
  @IsOptional()
  APP_PATH_BASE?: string = process.env.APP_PATH_BASE;

  @IsString()
  @IsOptional()
  URL_PREFIX?: string = process.env.URL_PREFIX;

  @IsString()
  @IsOptional()
  FRONTEND_APP_URL?: string = process.env.FRONTEND_APP_URL;

  @IsIn(['true', 'false'])
  @IsOptional()
  REDIRECT_AFTER_VERIFICATION?: string = process.env.REDIRECT_AFTER_VERIFICATION;

  @IsString()
  @IsOptional()
  REDIRECT_URL_AFTER_VERIFICATION?: string = process.env.REDIRECT_URL_AFTER_VERIFICATION;

  // Server
  @IsFQDN({ require_tld: false, allow_numeric_tld: true })
  @IsNotEmpty()
  HOST: string = process.env.HOST;

  @IsInt()
  @IsNotEmpty()
  PORT: number = +process.env.PORT;

  @IsString()
  @IsNotEmpty()
  PUBLIC_DIR: string = process.env.PUBLIC_DIR;

  @IsString()
  @IsNotEmpty()
  UPLOADS_DIR: string = process.env.UPLOADS_DIR;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  UPLOADS_MAX_FILE_SIZE = +process.env.UPLOADS_MAX_FILE_SIZE || 1024 * 1024;

  // log
  @IsString()
  @IsNotEmpty()
  LOG_LEVEL: string = process.env.LOG_LEVEL;

  @IsIn(['true', 'false'])
  @ValidateIf(({ LOG_TO_FILE }) => LOG_TO_FILE)
  @IsOptional()
  LOG_TO_FILE?: string = process.env.LOG_TO_FILE;

  @IsString()
  @IsNotEmpty()
  @ValidateIf(({ LOG_TO_FILE }) => LOG_TO_FILE === 'true')
  LOG_DIR: string = process.env.LOG_DIR;

  @Matches(/^([a-zA-Z0-9\s\._-]+)$/)
  @IsNotEmpty()
  @ValidateIf(({ LOG_TO_FILE }) => LOG_TO_FILE === 'true')
  LOG_FILENAME: string = process.env.LOG_FILENAME;

  // Session
  @IsString()
  @IsNotEmpty()
  SESSION_SECRET: string = process.env.SESSION_SECRET;

  @IsString()
  @IsOptional()
  SESSION_COOKIE_NAME?: string = process.env.SESSION_COOKIE_DOMAIN;

  @IsString()
  @IsOptional()
  SESSION_COOKIE_DOMAIN?: string = process.env.SESSION_COOKIE_NAME;

  // Cors
  @IsString()
  @IsOptional()
  CORS_ALLOWED_ORIGINS?: string = process.env.CORS_ALLOWED_ORIGINS;

  // DB
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string = process.env.DATABASE_URL;

  /* typeorm */
  @IsOptional()
  @IsIn(['advanced-console', 'simple-console', 'file', 'debug'])
  @ValidateIf(({ TYPEORM_LOGGER }) => TYPEORM_LOGGER)
  TYPEORM_LOGGER?: string = process.env.TYPEORM_LOGGER;

  // true, all, query, error, schema, warn, info, log
  @IsOptional()
  TYPEORM_LOGGING?: string = process.env.TYPEORM_LOGGING;

  // log all queries which run more then `maxQueryExecutionTime`
  @IsPositive()
  @IsInt()
  @IsOptional()
  TYPEORM_MAX_QUERY_EXECUTION_TIME?: number = +process.env.TYPEORM_MAX_QUERY_EXECUTION_TIME;

  /* mail */
  @IsFQDN()
  @IsNotEmpty()
  MAIL_HOST: string = process.env.MAIL_HOST;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  MAIL_PORT: number = +process.env.MAIL_PORT;

  @IsEmail()
  @IsNotEmpty()
  MAIL_USERNAME: string = process.env.MAIL_USERNAME;

  @IsString()
  @IsNotEmpty()
  MAIL_PASSWORD: string = process.env.MAIL_PASSWORD;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM_NAME: string = process.env.MAIL_FROM_NAME;

  @IsEmail()
  @IsNotEmpty()
  MAIL_FROM_EMAIL: string = process.env.MAIL_FROM_EMAIL;

  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  PASSWORD_RESET_TOKEN_TTL: number = +process.env.PASSWORD_RESET_TOKEN_TTL;

  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  EMAIL_VERIFICATION_TOKEN_TTL: number = +process.env.EMAIL_VERIFICATION_TOKEN_TTL;

  // Google OAuth 2.0
  @IsString()
  @IsNotEmpty()
  GOOGLE_AUTH_CLIENT_ID: string = process.env.GOOGLE_AUTH_CLIENT_ID;

  @IsString()
  @IsNotEmpty()
  GOOGLE_AUTH_CLIENT_SECRET: string = process.env.GOOGLE_AUTH_CLIENT_SECRET;

  // FaceBook
  @IsString()
  @IsNotEmpty()
  FACEBOOK_APP_ID: string = process.env.FACEBOOK_APP_ID;

  @IsString()
  @IsNotEmpty()
  FACEBOOK_APP_SECRET: string = process.env.FACEBOOK_APP_SECRET;

  // SSL
  @IsIn(['true', 'false'])
  @ValidateIf(({ SSL }) => SSL)
  @IsOptional()
  SSL?: string = process.env.SSL;

  @IsString()
  @ValidateIf(({ SSL }) => SSL === 'true')
  @IsNotEmpty()
  SSL_KEY_PATH?: string = process.env.SSL_KEY_PATH;

  @IsString()
  @ValidateIf((o) => o.SSL === 'true')
  @IsNotEmpty()
  SSL_CERT_PATH?: string = process.env.SSL_CERT_PATH;
}
