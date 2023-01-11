import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Query } from './entities/query.entity';

@Injectable()
export class QueriesService extends TypeOrmCrudService<Query> {
  constructor(
    @InjectRepository(Query) queryRepo,
  ) {
    super(queryRepo);
  }
}
