import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { getEnvPath } from './config/helpers/getEnvPath';
import { TypeOrmConfigService } from './config/typeorm/ormconfig.service';

const envFilePath = getEnvPath();
const staticPath =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, '..', 'public')
    : join(__dirname, '..', '..', 'public');
// validationSchema: validationSchema,
//     load: [configuration],
@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ServeStaticModule.forRoot({
      rootPath: staticPath,
    }),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
