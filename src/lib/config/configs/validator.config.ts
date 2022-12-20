import type { ValidatorOptions } from 'class-validator';

export const validatorConfig: ValidatorOptions = {
  whitelist: true,
  stopAtFirstError: true,
  enableDebugMessages: true,
  validationError: {
    target: true,
    value: true,
  },
};
