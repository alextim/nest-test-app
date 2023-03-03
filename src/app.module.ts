import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { NestConfigModule } from './lib/config/config.module';
import { NestPinoModule } from './lib/pino/pino.module';
import { OrmModule } from './lib/orm/orm.module';

import { NestServeStaticModule } from './lib/serve-static/serve-static.module';

import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { LocalFilesModule } from './modules/local-files/local-files.module';
import { GoogleAuthModule } from './modules/google-auth/google-auth.module';
import { ProxiesModule } from './modules/proxies/proxies.module';
import { CustomersModule } from './modules/customers/customers.module';
import { QueriesModule } from './modules/queries/queries.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { SelectorsModule } from './modules/selectors/selectors.module';
import { ParsersModule } from './modules/parsers/parsers.module';
import { TimezonesModule } from './modules/timezones/timezones.module';
import { ValidatorModule } from './validator.module';
import { PostsModule } from './modules/posts/posts.module';

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
    ProfileModule,
    UsersModule,
    HealthModule,
    LocalFilesModule,
    ProxiesModule,
    CustomersModule,
    QueriesModule,
    JobsModule,
    SchedulesModule,
    SelectorsModule,
    ParsersModule,
    TimezonesModule,
    ValidatorModule,
    PostsModule,
  ],
})
export class AppModule {}
