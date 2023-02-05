import type {
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { registerDecorator } from 'class-validator';

import { IntervalType } from '../modules/schedules/entities/schedule.types';
import { Schedule } from '../modules/schedules/entities/schedule.entity';
import { acceptedHours, acceptedMinutes } from './time-intervals';

export function IsValidTimeInterval(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IntervalValidator,
    });
  };
}

export class IntervalValidator implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const { intervalType } = args.object as Schedule;
    switch (intervalType) {
      case IntervalType.Hour:
        return acceptedHours.some((h) => h === value);
      case IntervalType.Minute:
        return acceptedMinutes.some((m) => m === value);
      default:
        throw new Error(`Unknown intervalType=${intervalType}`);
    }
  }

  defaultMessage(args?: ValidationArguments) {
    const { intervalType } = args.object as Schedule;
    switch (intervalType) {
      case IntervalType.Hour:
        return `$property not valid. Accepts ${acceptedHours.join(', ')}`;
      case IntervalType.Minute:
        return `$property not valid. Accepts ${acceptedMinutes.join(', ')}`;
      default:
        return `$property not valid. Unknown type ${intervalType}`;
    }
  }
}
