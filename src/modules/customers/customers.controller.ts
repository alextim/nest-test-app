import fs from 'node:fs/promises';
import {
  Controller,
} from '@nestjs/common';
import {
  Crud,
  CrudController,
} from '@nestjsx/crud';



import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Customer,
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('proxies')
export class CustomersController implements CrudController<Customer> {
  constructor(
    public readonly service: CustomersService,
  ) {}

  get base(): CrudController<Customer> {
    return this;
  }
}
