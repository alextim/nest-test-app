import type {
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator } from 'class-validator';
import cron from 'cron-validate';

export function IsCron(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: CronValidator,
    });
  };
}

class CronValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    const cronResult = cron(value);
    return cronResult.isValid();
  }

  defaultMessage() {
    return '$property not valid Cron expression';
  }
}
