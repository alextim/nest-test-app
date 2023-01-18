import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';

import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService extends TypeOrmCrudService<Customer> {
  constructor(@InjectRepository(Customer) customerRepo) {
    super(customerRepo);
  }
}
