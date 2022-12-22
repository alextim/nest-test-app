import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Role } from '../../users/entities/user.entity';
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
    
    // const requiredRoles = this.reflector.getAllAndOverride<Role[]>(Role, [context.getHandler(), context.getClass()]);
    const requiredRoles = this.reflector.get<Role[]>(
      Role,
      context.getHandler()
    );
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    // const { user } = req;
    const { user } = (req.session as any).passport as any;

    if (user.roles.some((role) => role === Role.ADMIN)) {
      return true;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}