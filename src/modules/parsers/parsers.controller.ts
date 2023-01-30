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
@Controller()
export class ParsersController {
  constructor(private readonly service: ParsersService) {}

  @Get('selectors/:selectorId/parsers')
  async getParsers(@Param('selectorId', ParseIntPipe) selectorId: number) {
    return this.service.getParsers(selectorId);
  }

  @Post('parsers/reorder')
  async reorderParsers(@Body() dto: ReorderParsersDto) {
    const allResults = await this.service.reorderParsers(dto);
    const failed: number[] = [];
    allResults.forEach(({ affected }, i) => {
      if (!affected) {
        failed.push(dto.items[i][0]);
      }
    });
    if (failed.length) {
      return new NotFoundException(
        `Parsers with ids = [${failed.join(', ')}] are not found`,
      );
    }
  }

  @Get('selectors/:selectorId/parsers/:parserId')
  async getParser(@Param('parserId', ParseIntPipe) parserId: number) {
    const parser = await this.service.getParser(parserId);
    if (!parser) {
      return new NotFoundException(`Parser id=${parserId} not found`);
    }
    return parser;
  }

  @Delete('selectors/:selectorId/parsers/:parserId')
  async deleteParser(@Param('parserId', ParseIntPipe) parserId: number) {
    const deletedRecord = await this.service.deleteParser(parserId);
    if (!deletedRecord) {
      return new NotFoundException(`Parser id=${parserId} not found`);
    }
    return deletedRecord;
  }

  @Post('selectors/:selectorId/parsers')
  async createParser(@Body() dto: CreateParserDto) {
    return this.service.createParser(dto);
  }

  @Patch('selectors/:selectorId/parsers/:parserId')
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
