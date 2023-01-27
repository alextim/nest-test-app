import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Query } from '../queries/entities/query.entity';

import { CreateParserDto } from './dto/create-parser.dto';
import { CreateSelectorDto } from './dto/create-selector.dto';
import { UpdateParserDto } from './dto/update-parser.dto';
import { UpdateSelectorDto } from './dto/update-selector.dto';
import { TreeItem } from './dto/update-tree.dto';

import { Parser } from './entities/parser.entity';
import { Selector } from './entities/selector.entity';

@Injectable()
export class SelectorsService {
  constructor(
    @InjectRepository(Selector)
    private readonly selectorRepo: Repository<Selector>,
    @InjectRepository(Query)
    private readonly queryRepo: Repository<Query>,
    @InjectRepository(Parser)
    private readonly parserRepo: Repository<Parser>,
  ) {}
  async queryExist(queryId: number) {
    return this.queryRepo.exist({ where: { id: queryId } });
  }

  async selectorExist(selectorId: number) {
    return this.selectorRepo.exist({ where: { id: selectorId } });
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
    const selector = await this.selectorRepo.findOne({ where: { id } });
    if (!selector) {
      return undefined;
    }
    const result = await this.selectorRepo.delete(id);
    if (!result.affected) {
      throw new HttpException(`Failed to delete selector id=${id}`, 500);
    }
    return selector;
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

  async validateIdParams(queryId: number, selectorId: number) {
    if (!(await this.queryExist(queryId))) {
      return new NotFoundException(`Query id=${queryId} not found`);
    }

    const selector = await this.getSelector(selectorId);
    if (!selector) {
      return new NotFoundException(`Selector id=${selectorId} not found`);
    }

    if (selector.queryId !== queryId) {
      return new BadRequestException(
        `Asked query id=${queryId}. Selector id=${selectorId} belongs to anther query id=${selector.queryId}`,
      );
    }
    return undefined;
  }

  async getParsers(selectorId: number) {
    return this.parserRepo.find({ where: { selectorId } });
  }

  async getParser(parserId: number) {
    return this.parserRepo.findOne({ where: { id: parserId } });
  }

  async deleteParser(parserId: number) {
    const parser = await this.parserRepo.findOne({ where: { id: parserId } });
    if (!parser) {
      return undefined;
    }
    const result = await this.parserRepo.delete(parserId);
    if (!result.affected) {
      throw new HttpException(`Failed to delete parser id=${parserId}`, 500);
    }
    return parser;
  }

  async createParser(p: CreateParserDto) {
    const entity = this.parserRepo.create(p);
    return this.parserRepo.save(entity);
  }

  async updateParser(id: number, p: UpdateParserDto) {
    const result = await this.parserRepo.update(id, p);
    if (!result.affected) {
      return undefined;
    }
    return this.getParser(id);
  }
}
