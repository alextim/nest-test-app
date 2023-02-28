import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from '../../shared/getEnvPath';

import { validate } from './env.validation';

// @Global()
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
