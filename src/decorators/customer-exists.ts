import type {
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ValidatorConstraint, registerDecorator } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../modules/customers/entities/customer.entity';

export function CustomerExists(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: CustomerExistsRule,
    });
  };
}

@ValidatorConstraint({ async: true })
export class CustomerExistsRule implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {}
  async validate(id: number) {
    const count = await this.repo.countBy({ id });
    return count > 0;
  }

  defaultMessage(args?: ValidationArguments) {
    return `Not valid ${args.property}. Customer with id=${args.value} not exist`;
  }
}
