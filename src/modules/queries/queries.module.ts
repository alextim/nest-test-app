import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueriesService } from './queries.service';
import { QueriesController } from './queries.controller';

import { Query } from './entities/query.entity';
import { Selector } from '../selectors/entities/selector.entity';
import { Parser } from '../selectors/entities/parser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Query, Parser, Selector])],
  controllers: [QueriesController],
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
