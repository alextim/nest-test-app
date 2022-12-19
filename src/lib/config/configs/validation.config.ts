import type { ValidatorOptions } from 'class-validator';

export const validationConfig: ValidatorOptions = {
  whitelist: true,
  stopAtFirstError: true,
  enableDebugMessages: true,
  validationError: {
    target: true,
    value: true,
  },
};
