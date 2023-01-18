import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Query } from '../queries/entities/query.entity';
import { CreateSelectorDto } from './dto/create-selector.dto';
import { UpdateSelectorDto } from './dto/update-selector.dto';

import { Selector } from './entities/selector.entity';

@Injectable()
export class SelectorsService {
  constructor(
    @InjectRepository(Selector)
    private readonly selectorRepo: Repository<Selector>,
    @InjectRepository(Query)
    private readonly queryRepo: Repository<Query>,
  ) {}
  async queryExist(queryId: number) {
    return this.queryRepo.exist({ where: { id: queryId } });
  }

  async getSelectors(queryId: number) {
    if (!(await this.queryExist(queryId))) {
      return undefined;
    }
    return this.selectorRepo.find({ where: { queryId } });
  }

  async getSelector(id: number) {
    return this.selectorRepo.findOne({ where: { id } });
  }

  async deleteSelector(id: number) {
    return this.selectorRepo.delete(id);
  }

  async createSelector(sel: CreateSelectorDto) {
    const entity = this.selectorRepo.create(sel);
    return this.selectorRepo.save(entity);
  }

  async updateSelector(sel: UpdateSelectorDto) {
    return this.selectorRepo.save(sel);
  }
}
