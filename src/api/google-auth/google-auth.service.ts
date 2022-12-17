import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { UserExternalAuthorizationDto } from './dto/user-external-authorization.dto';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly usersService: UsersService) {}
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
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
    if (providerName !== 'google') {
      throw new BadRequestException('Unsupported provider');
    }

    const user = await this.usersService.findByEmail(email);

    if (user) {
      if (!user.googleId) {
        await this.usersService.setGoogleId(user, providerId);
      }
      user.googleId = providerId;
      return user;
    }

    return this.usersService.create({
      email,
      firstName,
      lastName,
      googleId: providerId,
      isRegisteredWithGoogle: true,
    });
  }
}
