import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { Role, User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserMapper } from '../users/user-mapper';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  /**
   *  attach the {authenticate_user} to  req.session.passport.user.{authenticated_user}
   *
   * @param user
   * @param done
   */
  serializeUser(user: User, done: CallableFunction) {
    done(null, { id: user.id, roles: user.roles });
  }

  /**
   * get the {authenticated_user} for the session from
   * "req.session.passport.user.{authenticated_user}, and attach it to
   * req.user.{authenticated_user}
   *
   * @param userId
   * @param done
   */
  async deserializeUser(
    payload: { id: number; roles: Role[] },
    done: CallableFunction,
  ) {
    const user = await this.usersService.findById(payload.id);
    done(null, UserMapper.toDto(user));
  }
}
