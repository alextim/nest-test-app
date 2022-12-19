import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env.validation';

const getEnvPath = (): string => {
  const env = process.env.NODE_ENV;
  if (!env || env === 'production') {
    return '.env';
  }
  return `.${env}.env`;
};

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvPath(),
      validate,
      // load: [database, jwt],
      cache: true,
      isGlobal: true,
      // expandVariables: true,
      // validationSchema: ValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class NestConfigModule {}
