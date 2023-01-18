import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@rewiko/crud';

import { Job } from './entities/job.entity';
import { JobsService } from './jobs.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Job,
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('proxies')
export class JobsController implements CrudController<Job> {
  constructor(public readonly service: JobsService) {}
}
