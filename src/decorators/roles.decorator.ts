import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from '../modules/users/entities/user.entity';

/*
//https://github.com/joeygoksu/prime-nestjs/blob/main/src/custom.decorator.ts
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
*/

export const Roles = (...roles: Role[]): CustomDecorator<typeof Role> =>
  SetMetadata(Role, roles);