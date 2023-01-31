import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@rewiko/crud';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

import { Schedule } from './entities/schedule.entity';
import { SchedulesService } from './schedules.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Schedule,
  },
  dto: {
    create: CreateScheduleDto,
    update: UpdateScheduleDto,
    replace: CreateScheduleDto,
  },
  query: {
    join: {
      customer: { eager: true, allow: ['id', 'email'] },
      timezone: { eager: true, allow: ['id', 'code', 'name'] },
      proxy: { eager: true, allow: ['id', 'name'] },
    },
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('schedules')
export class SchedulesController implements CrudController<Schedule> {
  constructor(public readonly service: SchedulesService) {}
}
