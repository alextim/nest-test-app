import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import type { Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth/auth.service';

import { UserMapper } from '../users/user-mapper';
import { GOOGLE_REDIRECT_PATH } from './constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const callbackURL = `${configService.get<string>(
      'baseUrl',
    )}${configService.get<string>('urlPrefix')}/auth/${GOOGLE_REDIRECT_PATH}`;
    super({
      clientID: configService.get<string>('auth.google.clientId'),
      clientSecret: configService.get<string>('auth.google.clientSecret'),
      callbackURL,
      scope: ['email', 'profile'],
      // passReqToCallback:true
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const {
      id: providerId,
      provider: providerName,
      name,
      displayName,
      emails,
      photos,
    } = profile;

    const email = emails.find((x) => x.verified);
    if (!email) {
      throw new Error('No verified email returned from Google Authorization!');
    }

    const user = await this.authService.findOrCreateUser({
      providerId,
      providerName,

      email: email.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      name: displayName,
      avatar: photos[0]?.value,
    });

    done(null, UserMapper.toDto(user));

    // return user profile to serializeUser()
    // return user;
  }
}
