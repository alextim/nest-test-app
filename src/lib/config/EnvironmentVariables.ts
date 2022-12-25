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
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsString()
  @IsOptional()
  APP_PATH_BASE?: string;

  @IsString()
  @IsOptional()
  URL_PREFIX?: string;

  // Server
  @IsFQDN({ require_tld: false, allow_numeric_tld: true })
  @IsNotEmpty()
  HOST: string;

  @IsInt()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  PUBLIC_DIR: string;

  @IsString()
  @IsNotEmpty()
  UPLOADS_DIR: string;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  UPLOADS_MAX_FILE_SIZE = 1024 * 1024;

  // log
  @IsString()
  @IsNotEmpty()
  LOG_LEVEL: string;

  @IsIn(['true', 'false'])
  @ValidateIf(({ LOG_TO_FILE }) => LOG_TO_FILE)
  @IsOptional()
  LOG_TO_FILE?: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf(({ LOG_TO_FILE }) => LOG_TO_FILE === 'true')
  LOG_DIR: string;

  @Matches(/^([a-zA-Z0-9\s\._-]+)$/)
  @IsNotEmpty()
  @ValidateIf(({ LOG_TO_FILE }) => LOG_TO_FILE === 'true')
  LOG_FILENAME: string;

  // Session
  @IsString()
  @IsNotEmpty()
  SESSION_SECRET: string;

  @IsString()
  @IsOptional()
  SESSION_COOKIE_NAME?: string;

  @IsString()
  @IsOptional()
  SESSION_COOKIE_DOMAIN?: string;

  // Cors
  @IsString()
  @IsOptional()
  CORS_ALLOWED_ORIGINS?: string;

  // DB
  @IsFQDN({ require_tld: false, allow_numeric_tld: true })
  @IsNotEmpty()
  DB_HOST: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsOptional()
  DB_PASSWORD?: string;

  /* typeorm */
  @IsOptional()
  @IsIn(['advanced-console', 'simple-console', 'file', 'debug'])
  @ValidateIf(({ TYPEORM_LOGGER }) => TYPEORM_LOGGER)
  TYPEORM_LOGGER?: string;

  // true, all, query, error, schema, warn, info, log
  @IsOptional()
  TYPEORM_LOGGING?: string;

  // log all queries which run more then `maxQueryExecutionTime`
  @IsPositive()
  @IsInt()
  @IsOptional()
  TYPEORM_MAX_QUERY_EXECUTION_TIME?: number;

  /* mail */
  @IsFQDN()
  @IsNotEmpty()
  MAIL_HOST: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  MAIL_PORT: number;

  @IsEmail()
  @IsNotEmpty()
  MAIL_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  MAIL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM_NAME: string;

  @IsEmail()
  @IsNotEmpty()
  MAIL_FROM_EMAIL: string;

  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  PASSWORD_RESET_TOKEN_TTL: number;

  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  EMAIL_VERIFICATION_TOKEN_TTL: number;

  // Google OAuth 2.0
  @IsString()
  @IsNotEmpty()
  GOOGLE_AUTH_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_AUTH_CLIENT_SECRET: string;

  // FaceBook
  @IsString()
  @IsNotEmpty()
  FACEBOOK_APP_ID: string;

  @IsString()
  @IsNotEmpty()
  FACEBOOK_APP_SECRET: string;

  // SSL
  @IsIn(['true', 'false'])
  @ValidateIf(({ SSL }) => SSL)
  @IsOptional()
  SSL?: string;

  @IsString()
  @ValidateIf(({ SSL }) => SSL === 'true')
  @IsNotEmpty()
  SSL_KEY_PATH?: string;

  @IsString()
  @ValidateIf((o) => o.SSL === 'true')
  @IsNotEmpty()
  SSL_CERT_PATH?: string;
}
