import type {
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ValidatorConstraint, registerDecorator } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../modules/users/entities/user.entity';

export function UserExists(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: UserExistsRule,
    });
  };
}

@ValidatorConstraint({ async: true })
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  async validate(id: number) {
    const count = await this.repo.countBy({ id });
    return count > 0;
  }

  defaultMessage(args?: ValidationArguments) {
    return `Not valid ${args.property}. User with id=${args.value} not exist`;
  }
}
