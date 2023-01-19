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
} from '@nestjs/common';

import { CreateSelectorDto } from './dto/create-selector.dto';
import { UpdateSelectorDto } from './dto/update-selector.dto';

import { SelectorsService } from './selectors.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Controller()
export class SelectorsController {
  constructor(private readonly service: SelectorsService) { }
  
  @Patch('selectors/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSelectorDto,
  ) {
    console.log('update', id, dto.parentId)
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
    const result = await this.service.deleteSelector(id);
    if (!result.affected) {
      return new NotFoundException(`Selector id=${id} not found`);
    }
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
}
