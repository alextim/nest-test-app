import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';

import { Query } from './entities/query.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QueriesService extends TypeOrmCrudService<Query> {
  constructor(@InjectRepository(Query) queryRepo: Repository<Query>) {
    super(queryRepo);
  }
}
