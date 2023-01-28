import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParsersService } from './parsers.service';
import { ParsersController } from './parsers.controller';
import { Parser } from './entities/parser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parser])],
  controllers: [ParsersController],
  providers: [ParsersService],
  exports: [ParsersService],
})
export class ParsersModule {}
