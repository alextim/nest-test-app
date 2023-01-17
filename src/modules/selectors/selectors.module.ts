import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SelectorsService } from './selectors.service';
import { SelectorsController } from './selectors.controller';
import { Selector } from './entities/selector.entity';
import { Query } from '../queries/entities/query.entity';
import { Parser } from './entities/parser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Query, Parser, Selector])],
  controllers: [SelectorsController],
  providers: [SelectorsService],
  exports: [SelectorsService],
})
export class SelectorsModule {}
