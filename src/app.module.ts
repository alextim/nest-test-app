import { Module } from '@nestjs/common';

import { NestConfigModule } from './lib/config/config.module';
import { NestPinoModule } from './lib/pino/pino.module';
import { OrmModule } from './lib/orm/orm.module';
import { NestServeStaticModule } from './lib/serve-static/serve-static.module';

import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    NestConfigModule,
    NestPinoModule,
    OrmModule,
    NestServeStaticModule,
    AuthModule,
    AccountModule,
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}
