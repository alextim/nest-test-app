import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@rewiko/crud';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

import { Job } from './entities/job.entity';
import { JobsService } from './jobs.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Job,
  },
  dto: {
    create: CreateJobDto,
    update: UpdateJobDto,
    replace: CreateJobDto,
  },
  query: {
    join: {
      user: { eager: true, allow: ['id', 'email'] },
      customer: { eager: true, allow: ['id', 'email'] },
      query: { eager: true, allow: ['id', 'name'] },
      proxy: { eager: true, allow: ['id', 'name'] },
    },
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },  

})
@Controller('jobs')
export class JobsController implements CrudController<Job> {
  constructor(public readonly service: JobsService) {}
}
