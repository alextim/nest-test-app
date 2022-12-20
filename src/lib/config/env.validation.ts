import { Expose, plainToInstance } from 'class-transformer';
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
  ValidateIf,
  IsIn,
  IsFQDN,
  Matches
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
  @IsFQDN({ require_tld: false, allow_numeric_tld : true })
  @IsNotEmpty()
  HOST: string;

  @IsInt()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  PUBLIC_DIR: string;

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
  SESSION_NAME = 'connect.sid';

  @IsString()
  @IsOptional()
  SESSION_COOKIE_DOMAIN?: string;

  // DB
  @IsFQDN({ require_tld: false, allow_numeric_tld : true })
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
  DB_USER: string;

  @IsString()
  @IsOptional()
  DB_PASSWORD?: string;

  // typeorm
  @IsOptional()
  @IsIn(['advanced-console', 'simple-console', 'file', 'debug'])
  @ValidateIf(({ TYPEORM_LOGGER }) => TYPEORM_LOGGER)
  TYPEORM_LOGGER?: string;

  @IsOptional()
  TYPEORM_LOGGING?: string;

  @IsPositive()
  @IsInt()
  @IsOptional()
  TYPEORM_MAX_QUERY_EXECUTION_TIME?: number;
  
  // mail
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

  @Expose()
  get isProd() {
    return this.NODE_ENV === 'production';
  }

  @Expose()
  get isDev() {
    return this.NODE_ENV === 'development';
  }

  @Expose()
  get typeorm() {
    let logging: boolean | string | string[] | undefined = this.TYPEORM_LOGGING || undefined;
    if (logging) {
      if (logging === 'true') {
        logging = true;
      } else if (logging.includes(',')) {
        logging = logging.split(',');
      } 
    }
    return {
      // advanced-console, simple-console, file, debug 
      logger: this.TYPEORM_LOGGER, 
      // true, all, [query, error, schema, warn, info, log] 
      logging, 
      // log all queries which run more then `maxQueryExecutionTime`
      maxQueryExecutionTime: this.TYPEORM_MAX_QUERY_EXECUTION_TIME,       
    }
  }
}

export function validate(config: Record<string, unknown>) {
  const finalConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return finalConfig;
}
