import fs from 'node:fs/promises';
import {
  Controller,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
} from '@nestjsx/crud';



import { Schedule } from './entities/schedule.entity';
import { SchedulesService } from './schedules.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Schedule,
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('proxies')
export class SchedulesController implements CrudController<Schedule> {
  constructor(
    public readonly service: SchedulesService,
  ) {}

  get base(): CrudController<Schedule> {
    return this;
  }
}
