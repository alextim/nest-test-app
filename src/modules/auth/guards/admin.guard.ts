import { ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../../users/entities/user.entity';
import { CookieAuthGuard } from './cookie-auth.guard';


@Injectable()
export class AdminGuard extends CookieAuthGuard {
  async canActivate(context: ExecutionContext) {
    if (!(await super.canActivate(context))) {
      return false;
    }
    const req = context.switchToHttp().getRequest();

    // const { user } = req;
    const { user } = req.session.passport;
    return user.roles.some((role: string) => role === Role.ADMIN);
  }
}
