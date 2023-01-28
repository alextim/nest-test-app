import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { CreateParserDto } from './dto/create-parser.dto';
import { ReorderParsersDto } from './dto/reorder-parser.dto';
import { UpdateParserDto } from './dto/update-parser.dto';

import { Parser } from './entities/parser.entity';

@Injectable()
export class ParsersService {
  constructor(
    @InjectRepository(Parser)
    private readonly parserRepo: Repository<Parser>,
  ) {}
  async parserExist(id: number) {
    return this.parserRepo.exist({ where: { id } });
  }
  async getParsers(selectorId: number) {
    return this.parserRepo.find({
      where: { selectorId },
      order: { sortOrder: 'ASC' },
    });
  }

  async getParser(id: number) {
    return this.parserRepo.findOne({ where: { id } });
  }

  async deleteParser(id: number) {
    const parser = await this.parserRepo.findOne({ where: { id } });
    if (!parser) {
      return undefined;
    }
    const result = await this.parserRepo.delete(id);
    if (!result.affected) {
      throw new HttpException(`Failed to delete parser id=${id}`, 500);
    }
    return parser;
  }

  async createParser(p: CreateParserDto) {
    const entity = this.parserRepo.create(p);
    if (!entity.sortOrder && entity.sortOrder !== 0) {
      const q = this.parserRepo
        .createQueryBuilder('parser')
        .select('MAX(parser.sortOrder)', 'max')
        .where({ selectorId: p.selectorId });
      const result = await q.getRawOne();
      entity.sortOrder = result.max + 1;
    }
    return this.parserRepo.save(entity);
  }

  async updateParser(id: number, p: UpdateParserDto) {
    const result = await this.parserRepo.update(id, p);
    if (!result.affected) {
      return undefined;
    }
    return this.getParser(id);
  }

  async reorderParsers({ items }: ReorderParsersDto) {
    return Promise.all(
      items.map(([id, sortOrder]) =>
        this.parserRepo.update(
          { id, sortOrder: Not(sortOrder) },
          { sortOrder },
        ),
      ),
    );
  }
}
