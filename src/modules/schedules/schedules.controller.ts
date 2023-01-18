import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@rewiko/crud';

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
  constructor(public readonly service: SchedulesService) {}
}
