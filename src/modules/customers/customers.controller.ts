import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@rewiko/crud';

import { Customer } from './entities/customer.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

// @ApiCookieAuth()
// @UseGuards(SelfGuard)
@Crud({
  model: {
    type: Customer,
  },
  query: {
    join: {
      linkedInProfile: { eager: true, allow: ['id', 'authCookie'] },
    },
  },
  dto: {
    create: CreateCustomerDto,
    update: UpdateCustomerDto,
    replace: UpdateCustomerDto,
  },
  routes: {
    deleteOneBase: {
      returnDeleted: true,
    },
  },
})
@Controller('customers')
export class CustomersController implements CrudController<Customer> {
  constructor(public readonly service: CustomersService) {}
}
