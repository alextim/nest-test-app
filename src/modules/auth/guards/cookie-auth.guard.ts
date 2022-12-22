import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return req.isAuthenticated();
  }
}
