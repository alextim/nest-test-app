import { plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsString,
  validateSync,
  IsUrl,
  IsPositive,
  IsBoolean,
} from 'class-validator';

enum Environment {
  Dev = 'development',
  Prod = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string;

  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    require_tld: false,
    require_host: true,
    require_port: false,
  })
  @IsNotEmpty()
  BASE_URL: string;

  // Server
  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsInt()
  @IsNotEmpty()
  PORT: number;

  // Session
  @IsString()
  @IsNotEmpty()
  SESSION_SECRET: string;

  @IsString()
  @IsOptional()
  SESSION_NAME = 'connect.sid';

  @IsString()
  @IsOptional()
  SESSION_COOKIE_DOMAIN?: string;

  // DB
  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsInt()
  @IsNotEmpty()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsOptional()
  DB_PASSWORD: string;

  // mail
  @IsString()
  @IsNotEmpty()
  MAIL_HOST: string;

  @IsInt()
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
  @IsBoolean()
  @IsNotEmpty()
  SSL: boolean;

  @IsString()
  @IsNotEmpty()
  SSL_KEY_PATH: string;

  @IsString()
  @IsNotEmpty()
  SSL_CERT_PATH: string;
}

export function validate(config: Record<string, unknown>) {
  const finalConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return finalConfig;
}
