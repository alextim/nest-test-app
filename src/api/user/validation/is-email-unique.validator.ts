import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'IsEmailUnique', async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  async validate(email: string, args: ValidationArguments) {
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
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsEmailUniqueConstraint,
    });
  };
}
