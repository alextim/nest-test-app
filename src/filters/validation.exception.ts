import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: string[] | any) {
    super(validationErrors);
  }
}
