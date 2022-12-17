import { ExecutionContext, Injectable } from '@nestjs/common';

import { LocalLoginGuard } from './local-login.guard';

@Injectable()
export class AdminGuard extends LocalLoginGuard {
  async canActivate(context: ExecutionContext) {
    /*
    if (!(await super.canActivate(context))) {
      return false;
    }
    */
    const req = context.switchToHttp().getRequest();
    if (!req.isAuthenticated()) {
      return false;
    }

    const { user } = req.session.passport;
    const isAdmin = user.roles.some((role: string) => role === 'admin');
    return isAdmin;
  }
}
