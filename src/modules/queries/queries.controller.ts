import fs from 'node:fs/promises';
import {
  Controller,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
} from '@nestjsx/crud';



import { Query } from './entities/query.entity';
import { QueriesService } from './queries.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Query,
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('proxies')
export class QueriesController implements CrudController<Query> {
  constructor(
    public readonly service: QueriesService,
  ) {}

  get base(): CrudController<Query> {
    return this;
  }
}
