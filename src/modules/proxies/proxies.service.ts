import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Proxy } from './entities/proxy.entity';

@Injectable()
export class ProxiesService extends TypeOrmCrudService<Proxy> {
  constructor(
    @InjectRepository(Proxy) proxyRepo,
  ) {
    super(proxyRepo);
  }
}
