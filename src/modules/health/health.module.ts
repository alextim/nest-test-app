import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { OrmModule } from '../../lib/orm/orm.module';
import { HealthController } from './health.controller';

@Module({
  imports: [OrmModule, TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
