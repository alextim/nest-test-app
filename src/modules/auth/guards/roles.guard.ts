import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { Role } from '../../users/entities/role.enum';
import { User } from '../../users/entities/user.entity';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { CookieAuthGuard } from './cookie-auth.guard';

@Injectable()
export class RolesGuard extends CookieAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (!(await super.canActivate(context))) {
      return false;
    }

    // const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    let requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      requiredRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getClass());
    }

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const user: User = req.user as User; // Use passport authentication strategy, i.e. get authenticated user from request

    if (User.isAdmin(user)) {
      return true;
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
