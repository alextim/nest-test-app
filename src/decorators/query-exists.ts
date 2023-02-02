import type {
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ValidatorConstraint, registerDecorator } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Query } from '../modules/queries/entities/query.entity';

export function QueryExists(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: QueryExistsRule,
    });
  };
}

@ValidatorConstraint({ async: true })
export class QueryExistsRule implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Query) private repo: Repository<Query>) {}
  async validate(id: number) {
    const count = await this.repo.countBy({ id });
    return count > 0;
  }

  defaultMessage(args?: ValidationArguments) {
    return `Not valid ${args.property}. Query with id=${args.value} not exist`;
  }
}
