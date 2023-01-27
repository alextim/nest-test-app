import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateParserDto } from './dto/create-parser.dto';
import { UpdateSelectorDto } from './dto/update-selector.dto';

import { CreateSelectorDto } from './dto/create-selector.dto';
import { UpdateParserDto } from './dto/update-parser.dto';

import { UpdateTreeDto } from './dto/update-tree.dto';

import { SelectorsService } from './selectors.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Controller()
export class SelectorsController {
  constructor(private readonly service: SelectorsService) {}

  @Patch('selectors/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSelectorDto,
  ) {
    console.log('update', id, dto.parentId);
    const selector = await this.service.updateSelector(id, dto);
    if (!selector) {
      return new NotFoundException(`Selector id=${id} not found`);
    }
    return selector;
  }

  @Get('queries/:queryId/selectors')
  async getSelectors(@Param('queryId', ParseIntPipe) queryId: number) {
    if (!(await this.service.queryExist(queryId))) {
      return new NotFoundException(`Query id=${queryId} not found`);
    }
    const selectors = await this.service.getSelectors(queryId);
    if (!selectors?.length) {
      return [];
    }
    return selectors;
  }

  @Get('queries/:queryId/selectors/:id')
  async getSelector(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!(await this.service.queryExist(queryId))) {
      return new NotFoundException(`Query id=${queryId} not found`);
    }
    const selector = await this.service.getSelector(id);
    if (!selector) {
      return new NotFoundException(`Selector id=${id} not found`);
    }
    return selector;
  }

  @Delete('queries/:queryId/selectors/:id')
  async deleteSelector(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!(await this.service.queryExist(queryId))) {
      return new NotFoundException(`Query id=${queryId} not found`);
    }
    const deletedRecord = await this.service.deleteSelector(id);
    if (!deletedRecord) {
      return new NotFoundException(`Selector id=${id} not found`);
    }
    return deletedRecord;
  }

  @Post('queries/:queryId/selectors')
  async createSelector(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Body() dto: CreateSelectorDto,
  ) {
    if (!(await this.service.queryExist(queryId))) {
      return new NotFoundException(`Query id=${queryId} not found`);
    }
    const selector = await this.service.createSelector(dto);
    return selector;
  }

  @Patch('queries/:queryId/selectors/:id')
  async updateSelector(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSelectorDto,
  ) {
    if (!(await this.service.queryExist(queryId))) {
      return new NotFoundException(`Query id=${queryId} not found`);
    }
    const selector = await this.service.updateSelector(id, dto);
    if (!selector) {
      return new NotFoundException(`Selector id=${id} not found`);
    }
    return selector;
  }

  @HttpCode(200)
  @Post('queries/:queryId/selectors/updateTree')
  async updateTree(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Body() { items }: UpdateTreeDto,
  ) {
    if (!(await this.service.queryExist(queryId))) {
      return new NotFoundException(`Query id=${queryId} not found`);
    }
    await this.service.updateTree(queryId, items);
  }

  @Get('queries/:queryId/selectors/:selectorId/parsers')
  async getParsers(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Param('selectorId', ParseIntPipe) selectorId: number,
  ) {
    const err = await this.service.validateIdParams(queryId, selectorId);
    if (err) {
      return err;
    }
    return this.service.getParsers(selectorId);
  }

  @Get('queries/:queryId/selectors/:selectorId/parsers/:parserId')
  async getParser(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Param('selectorId', ParseIntPipe) selectorId: number,
    @Param('parserId', ParseIntPipe) parserId: number,
  ) {
    const err = await this.service.validateIdParams(queryId, selectorId);
    if (err) {
      return err;
    }
    const parser = await this.service.getParser(parserId);
    if (!parser) {
      return new NotFoundException(`Parser id=${parserId} not found`);
    }
    return parser;
  }

  @Delete('queries/:queryId/selectors/:selectorId/parsers/:parserId')
  async deleteParser(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Param('selectorId', ParseIntPipe) selectorId: number,
    @Param('parserId', ParseIntPipe) parserId: number,
  ) {
    const err = await this.service.validateIdParams(queryId, selectorId);
    if (err) {
      return err;
    }
    const deletedRecord = await this.service.deleteParser(parserId);
    if (!deletedRecord) {
      return new NotFoundException(`Parser id=${parserId} not found`);
    }
    return deletedRecord;
  }

  @Post('queries/:queryId/selectors/:selectorId/parsers')
  async createParser(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Param('selectorId', ParseIntPipe) selectorId: number,
    @Param('parserId', ParseIntPipe) parserId: number,
    @Body() dto: CreateParserDto,
  ) {
    const err = await this.service.validateIdParams(queryId, selectorId);
    if (err) {
      return err;
    }
    const parser = await this.service.createParser(dto);
    return parser;
  }

  @Patch('queries/:queryId/selectors/:selectorId/parsers/:parserId')
  async updateParser(
    @Param('queryId', ParseIntPipe) queryId: number,
    @Param('selectorId', ParseIntPipe) selectorId: number,
    @Param('parserId', ParseIntPipe) parserId: number,
    @Body() dto: UpdateParserDto,
  ) {
    const err = await this.service.validateIdParams(queryId, selectorId);
    if (err) {
      return err;
    }
    const parser = await this.service.updateParser(parserId, dto);
    if (!parser) {
      return new NotFoundException(`Parser id=${parserId} not found`);
    }
    return parser;
  }
}
