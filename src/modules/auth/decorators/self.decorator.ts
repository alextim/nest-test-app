// https://gist.github.com/DimosthenisK/db21929a137d3e6c147f0bda3ecfbda6
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/entities/user.entity';
import { PartialWithRequired } from '../../../types';

export interface SelfDecoratorOptions {
  userIdParam: string;
  roles?: Role[];
  forbid: string[];
  userIdField: string;
}

export const defaultSelfDecoratorOptions: SelfDecoratorOptions = {
  userIdParam: 'id',
  userIdField: 'id',
  forbid: ['DELETE'],
};

const getOptions = (
  options:
    | PartialWithRequired<SelfDecoratorOptions, 'userIdParam'>
    | string
    | undefined,
): SelfDecoratorOptions => {
  if (!options) {
    return defaultSelfDecoratorOptions;
  }
  if (typeof options === 'string') {
    return { ...defaultSelfDecoratorOptions, userIdParam: options };
  }
  return { ...defaultSelfDecoratorOptions, ...options };
};
export const SELF_KEY = 'selfOptions';

export const Self = (
  options?: PartialWithRequired<SelfDecoratorOptions, 'userIdParam'> | string,
) => SetMetadata(SELF_KEY, getOptions(options));
