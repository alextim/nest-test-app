import {
  ForbiddenException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    if (!(await user.comparePasswords(plainTextPassword))) {
      throw new UnauthorizedException('Wrong credentials');
    }

    if (!user.verifiedAt) {
      throw new ForbiddenException(
        'You need to complete email verification to login. Check your mail',
      );
    }

    return user;
  }
}
