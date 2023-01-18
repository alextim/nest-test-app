import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';

import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService extends TypeOrmCrudService<Schedule> {
  constructor(@InjectRepository(Schedule) scheduleRepo) {
    super(scheduleRepo);
  }
}
