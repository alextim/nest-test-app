import fs from 'node:fs/promises';
import {
  Controller,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
} from '@nestjsx/crud';



import { Proxy } from './entities/proxy.entity';
import { ProxiesService } from './proxies.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Proxy,
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('proxies')
export class ProxiesController implements CrudController<Proxy> {
  constructor(
    public readonly service: ProxiesService,
  ) {}

  get base(): CrudController<Proxy> {
    return this;
  }
}
