import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateParserDto } from './dto/create-parser.dto';
import { ReorderParsersDto } from './dto/reorder-parser.dto';
import { UpdateParserDto } from './dto/update-parser.dto';

import { ParsersService } from './parsers.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Controller('parsers')
export class ParsersController {
  constructor(private readonly service: ParsersService) {}

  @Get()
  async getParsers(@Query('selectorId', ParseIntPipe) selectorId: number) {
    return this.service.getParsers(selectorId);
  }

  @Post('reorder')
  async reorderParsers(@Body() dto: ReorderParsersDto) {
    const allResults = await this.service.reorderParsers(dto);
    const ids: number[] = [];
    allResults.forEach(({ affected }, i) => {
      if (!affected) {
        ids.push(dto.items[i][0]);
      }
    });
    if (ids.length) {
      return new NotFoundException(
        `Parsers with ids = [${ids.join(', ')}] are not found`,
      );
    }
  }

  @Get(':parserId')
  async getParser(@Param('parserId', ParseIntPipe) parserId: number) {
    const parser = await this.service.getParser(parserId);
    if (!parser) {
      return new NotFoundException(`Parser id=${parserId} not found`);
    }
    return parser;
  }

  @Delete(':parserId')
  async deleteParser(@Param('parserId', ParseIntPipe) parserId: number) {
    const deletedRecord = await this.service.deleteParser(parserId);
    if (!deletedRecord) {
      return new NotFoundException(`Parser id=${parserId} not found`);
    }
    return deletedRecord;
  }

  @Post()
  async createParser(@Body() dto: CreateParserDto) {
    return this.service.createParser(dto);
  }

  @Patch(':parserId')
  async updateParser(
    @Param('parserId', ParseIntPipe) parserId: number,
    @Body() dto: UpdateParserDto,
  ) {
    const parser = await this.service.updateParser(parserId, dto);
    if (!parser) {
      return new NotFoundException(`Parser id=${parserId} not found`);
    }
    return parser;
  }
}
