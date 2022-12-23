import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    return context.switchToHttp().getRequest().isAuthenticated(); // Use passport authentication strategy
  }
}
