import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleLoginGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the email and the password
    const result = (await super.canActivate(context)) as boolean;

    // initialize the session
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    // if no exceptions were thrown, allow the access to the route
    // return true;
    // TODO:
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
