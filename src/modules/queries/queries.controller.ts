import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';

import { Query } from './entities/query.entity';
import { QueriesService } from './queries.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Query,
  },
  dto: {
    create: CreateQueryDto,
    update: UpdateQueryDto,
    replace: CreateQueryDto,
  },
  query: {
    join: {
      proxy: { eager: true, allow: ['id', 'name'] },
    },
  },  
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('queries')
export class QueriesController implements CrudController<Query> {
  constructor(public readonly service: QueriesService) {}

  @Get(':id/selectors')
  async getSelectors(@Param('id', ParseIntPipe) id: number) {
    const selectors = await this.service.getSelectors(id);
    if (!selectors?.length) {
      return new NotFoundException('No selectors found');
    }
    return selectors;
  }
}
