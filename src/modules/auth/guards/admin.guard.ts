import { ExecutionContext, Injectable } from '@nestjs/common';

import { LoginGuard } from './login.guard';

@Injectable()
export class AdminGuard extends LoginGuard {
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
