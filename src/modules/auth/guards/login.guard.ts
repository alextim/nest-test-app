import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginGuard extends AuthGuard(['local', 'google', 'facebook']) {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the credentials (email/password or google or fb)
    const result = (await super.canActivate(context)) as boolean;

    // initialize the session
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    return result;
  }
  /*
    handleRequest(err, user, info) {
    // If authentication fails, we throw an UnauthorizedException so that
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
  */
}
