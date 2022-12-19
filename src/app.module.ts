import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { NestPinoModule } from './lib/pino/pino.module';
import { OrmModule } from './lib/orm/orm.module';
import { NestConfigModule } from './lib/config/config.module';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    NestConfigModule,
    NestPinoModule,
    OrmModule,
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => [
        { rootPath: join(__dirname, configService.get<string>('PUBLIC_DIR')) },
      ],
      inject: [ConfigService],
    }),
    UsersModule,
    HealthModule,
    AuthModule,
    AccountModule,
  ],
})
export class AppModule {}
