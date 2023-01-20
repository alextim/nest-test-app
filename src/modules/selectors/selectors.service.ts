import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Query } from '../queries/entities/query.entity';
import { CreateSelectorDto } from './dto/create-selector.dto';
import { UpdateSelectorDto } from './dto/update-selector.dto';
import { TreeItem } from './dto/update-tree.dto';

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

  async updateSelector(id: number, sel: UpdateSelectorDto) {
    const result = await this.selectorRepo.update(id, sel);
    if (!result.affected) {
      return undefined;
    }
    return this.getSelector(id);
  }

  async updateTree(queryId: number, items: TreeItem[]) {
    return Promise.all(
      items.map(async ([id, parentId]) => {
        const selector = await this.selectorRepo.findOne({ where: { id } });
        if (!selector) {
          return Promise.reject(
            new NotFoundException(`Selector id=${id} not found`),
          );
        }
        if (selector.parentId !== parentId) {
          if (selector.queryId !== queryId) {
            return Promise.reject(
              new NotFoundException(
                `Asked queryId=${queryId}. Selector id=${id} belongs to another query with id=${selector.queryId}`,
              ),
            );
          }
          if (parentId) {
            if (!(await this.selectorRepo.exist({ where: { id: parentId } }))) {
              return Promise.reject(
                new NotFoundException(
                  `Parent selector with id=${parentId} not found`,
                ),
              );
            }
          }
          const result = await this.selectorRepo.update(id, { parentId });
          if (result.affected !== 1) {
            return Promise.reject(
              new NotFoundException(`Selector id=${id} not found`),
            );
          }
        }
        return Promise.resolve();
      }),
    );
  }
}
