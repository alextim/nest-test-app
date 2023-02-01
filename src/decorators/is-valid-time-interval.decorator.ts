import { ValidationOptions, registerDecorator } from 'class-validator';

import { IntervalType } from '../modules/schedules/entities/schedule.types';
import { Schedule } from '../modules/schedules/entities/schedule.entity';

export function IsValidTimeInterval(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value, args) {
          const { intervalType } = args.object as Schedule;
          switch (intervalType) {
            case IntervalType.Hour:
              return [1, 2, 3, 4, 6, 12].some((h) => h === value);
            case IntervalType.Minute:
              return [1, 2, 3, 4, 5, 10, 15, 20, 30].some((m) => m === value);
            default:
              throw new Error(`Unknown intervalType=${intervalType}`);
          }
        },
      },
    });
  };
}
