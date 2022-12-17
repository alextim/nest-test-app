import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/UserDto';
import { UserMapper } from '../users/user-mapper';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserDto> {
    const user = await this.authService.getAuthenticatedUser(email, password);
    return UserMapper.toDto(user);
  }
}
