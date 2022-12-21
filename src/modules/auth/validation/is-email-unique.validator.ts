import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { UsersService } from '../../users/users.service';

@ValidatorConstraint({ name: 'IsEmailUnique', async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
  ) {}

  async validate(email: string) {
    if (!email) {
      return true;
    }
    const exists = await this.userService.emailExists(email);
    return !exists;
  }

  defaultMessage({ property, value }: ValidationArguments) {
    return `User with ${property} ${value} already exists`;
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsEmailUniqueConstraint,
    });
  };
}
