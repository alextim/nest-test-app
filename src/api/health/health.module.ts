import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';

import { getTypeOrmOptions } from '../../config/typeorm/typeorm-module.options';
import { HealthController } from './health.controller';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmOptions,
      inject: [ConfigService],
    }),
    TerminusModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
