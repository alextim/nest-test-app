import { Controller } from '@nestjs/common';

import { Crud, CrudController } from '@rewiko/crud';

import { Timezone } from './entities/timezone.entity';
import { TimezonesService } from './timezones.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Timezone,
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('timezones')
export class TimezonesController implements CrudController<Timezone> {
  constructor(public readonly service: TimezonesService) {}
}
