import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { NestConfigModule } from './lib/config/config.module';
import { NestPinoModule } from './lib/pino/pino.module';
import { OrmModule } from './lib/orm/orm.module';
import { NestServeStaticModule } from './lib/serve-static/serve-static.module';

import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { LocalFilesModule } from './modules/local-files/local-files.module';
import { GoogleAuthModule } from './modules/google-auth/google-auth.module';


@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  imports: [
    NestConfigModule,
    NestPinoModule,
    OrmModule,
    NestServeStaticModule,
    AuthModule,
    GoogleAuthModule,
    AccountModule,
    UsersModule,
    HealthModule,
    LocalFilesModule,
  ],
})
export class AppModule {}
