import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule } from './entities/schedule.entity';
import { Timezone } from './entities/timezone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Timezone])],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
