import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerExistsRule } from './decorators/customer-exists';
import { ProxyExistsRule } from './decorators/proxy-exists';
import { QueryExistsRule } from './decorators/query-exists';
import { UserExistsRule } from './decorators/user-exists';

import { Customer } from './modules/customers/entities/customer.entity';
import { Query } from './modules/queries/entities/query.entity';
import { User } from './modules/users/entities/user.entity';
import { Proxy } from './modules/proxies/entities/proxy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Customer, Query, Proxy])],
  providers: [
    UserExistsRule,
    CustomerExistsRule,
    QueryExistsRule,
    ProxyExistsRule,
  ],
})
export class ValidatorModule {}
