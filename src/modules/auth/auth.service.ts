import {
  ForbiddenException,
  UnauthorizedException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { UserExternalAuthorizationDto } from './dto/user-external-authorization.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid username/password');
    }

    if (!(await user.comparePasswords(plainTextPassword))) {
      throw new UnauthorizedException('Invalid username/password');
    }

    if (!user.verifiedAt) {
      throw new ForbiddenException(
        'You need to complete email verification to login. Check your mail',
      );
    }

    return user;
  }

  async findOrCreateUser({
    providerId,
    providerName,
    email,
    firstName,
    lastName,
  }: UserExternalAuthorizationDto) {
    if (!providerId) {
      throw new BadRequestException('providerId required');
    }

    let facebookId: string;
    let googleId: string;

    switch (providerName) {
      case 'google':
        googleId = providerId;
        break;
      case 'facebook':
        facebookId = providerId;
        break;
      default:
        throw new BadRequestException('Unsupported provider');
    }

    const user = await this.usersService.findByEmail(email);

    if (user) {
      if (googleId) {
        if (!user.googleId) {
          await this.usersService.setGoogleId(user, providerId);
          user.googleId = providerId;
        }
      } else if (facebookId) {
        if (!user.facebookId) {
          await this.usersService.setFacebookId(user, facebookId);
          user.facebookId = facebookId;
        }
      }
      return user;
    }

    return this.usersService.create({
      email,
      firstName,
      lastName,
      googleId,
      isRegisteredWithGoogle: !!googleId,
      facebookId,
      isRegisteredWithFacebook: !!facebookId,
    });
  }
}
