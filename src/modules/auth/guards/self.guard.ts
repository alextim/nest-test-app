// https://gist.github.com/DimosthenisK/db21929a137d3e6c147f0bda3ecfbda6
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { User } from '../../users/entities/user.entity';
import {
  defaultSelfDecoratorOptions,
  SelfDecoratorOptions,
} from '../decorators/self.decorator';
import { SELF_KEY } from '../decorators/self.decorator';
import { CookieAuthGuard } from './cookie-auth.guard';

@Injectable()
export class SelfGuard extends CookieAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (!(await super.canActivate(context))) {
      return false;
    }
    // Priority on method meta
    let options = this.reflector.get<SelfDecoratorOptions>(
      SELF_KEY,
      context.getHandler(),
    );
    if (!options) {
      // Check for class meta
      options = this.reflector.get<SelfDecoratorOptions>(
        SELF_KEY,
        context.getClass(),
      );
    }
    if (!options) {
      options = defaultSelfDecoratorOptions;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const user: User = req.user as User; // Use passport authentication strategy, i.e. get authenticated user from request

    if (User.isAdmin(user)) {
      return true;
    }

    if (req.params[options.userIdParam] == user[options.userIdField]) {
      return !options.forbid.some((method) => method === req.method);
    }

    const requiredRoles = options.roles;
    if (!requiredRoles) {
      return false;
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
