import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Selector } from '../selectors/entities/selector.entity';
import { Parser } from '../parsers/entities/parser.entity';

import { Query } from './entities/query.entity';
import { QueriesService } from './queries.service';
import { QueriesController } from './queries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Query, Parser, Selector])],
  controllers: [QueriesController],
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
