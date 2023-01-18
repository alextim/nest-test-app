import { Controller } from '@nestjs/common';

import { Crud, CrudController } from '@rewiko/crud';

import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';

import { Proxy } from './entities/proxy.entity';
import { ProxiesService } from './proxies.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Proxy,
  },
  dto: {
    create: CreateProxyDto,
    update: UpdateProxyDto,
    replace: CreateProxyDto,
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('proxies')
export class ProxiesController implements CrudController<Proxy> {
  constructor(public readonly service: ProxiesService) {}
}
