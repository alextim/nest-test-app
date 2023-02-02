import type {
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ValidatorConstraint, registerDecorator } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Proxy } from '../modules/proxies/entities/proxy.entity';

export function ProxyExists(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: ProxyExistsRule,
    });
  };
}

@ValidatorConstraint({ async: true })
export class ProxyExistsRule implements ValidatorConstraintInterface {
  constructor(@InjectRepository(Proxy) private repo: Repository<Proxy>) {}
  async validate(id: number) {
    const count = await this.repo.countBy({ id });
    return count > 0;
  }

  defaultMessage(args?: ValidationArguments) {
    return `Not valid ${args.property}. Proxy with id=${args.value} not exist`;
  }
}
