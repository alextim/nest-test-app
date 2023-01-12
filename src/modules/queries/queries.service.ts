import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Parser } from './entities/parser.entity';

import { Query } from './entities/query.entity';
import { Selector } from './entities/selector.entity';

@Injectable()
export class QueriesService extends TypeOrmCrudService<Query> {
  constructor(
    @InjectRepository(Query) queryRepo,
    @InjectRepository(Selector) private readonly selectorRepo,
    @InjectRepository(Parser) private readonly parserRepo
  ) {
    super(queryRepo);
  }

  async getSelectors(queryId: number) {
    if (!(await this.repo.exist({ where: { id: queryId } }))) {
      return undefined;
    }
    return this.selectorRepo.find({ where: { queryId } });
  }
}
