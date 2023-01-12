import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

import { Customer } from './entities/customer.entity';
import { LinkedInProfile } from './entities/linked-in-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, LinkedInProfile])],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
