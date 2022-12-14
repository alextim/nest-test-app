import { plainToClass } from 'class-transformer';
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
} from 'class-validator';

enum EnvironmentType {
  Dev = 'development',
  Prod = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(EnvironmentType)
  NODE_ENV: EnvironmentType;

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

  // Auth
  @IsString()
  @IsNotEmpty()
  SESSION_SECRET: string;

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
}

export function validate(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: true });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return finalConfig;
}
