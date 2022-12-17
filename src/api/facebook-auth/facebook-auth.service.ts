import { BadRequestException, Injectable } from '@nestjs/common';
import { UserExternalAuthorizationDto } from '../google-auth/dto/user-external-authorization.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class FacebookAuthService {
  constructor(private readonly usersService: UsersService) {}
  facebookLogin(req) {
    if (!req.user) {
      return 'No user from facebook';
    }

    return {
      message: 'User information from facebook',
      user: req.user,
    };
  }

  async findOrCreateUser({
    providerId,
    providerName,
    email,
    firstName,
    lastName,
  }: UserExternalAuthorizationDto) {
    if (providerName !== 'facebook') {
      throw new BadRequestException('Unsupported provider');
    }

    const user = await this.usersService.findByEmail(email);

    if (user) {
      if (!user.facebookId) {
        await this.usersService.setFacebookId(user, providerId);
      }
      user.facebookId = providerId;
      return user;
    }

    return this.usersService.create({
      email,
      firstName,
      lastName,
      facebookId: providerId,
      isRegisteredWithFacebook: true,
    });
  }
}
