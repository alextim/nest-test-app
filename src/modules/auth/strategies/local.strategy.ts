import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { validate } from 'class-validator';

import { validationConfig } from '../../../lib/config/configs/validation.config';

import { UserDto } from '../../users/dto/UserDto';
import { UserMapper } from '../../users/user-mapper';

import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserDto> {
    const dto = new LoginDto(email, password);
    const errors = await validate(dto, validationConfig);
    if (errors.length > 0) {
      throw new UnauthorizedException('Invalid username/password');
    }

    const user = await this.authService.getAuthenticatedUser(email, password);
    return UserMapper.toDto(user);
  }
}
