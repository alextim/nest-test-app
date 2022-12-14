import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-facebook';

import { UserMapper } from '../../users/user-mapper';
import { AuthService } from '../auth.service';

import { StrategyFacebookProfile } from '../interfaces/strategy-facebook-profile.interface';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('auth.facebook.appId'),
      clientSecret: configService.get<string>('auth.facebook.appSecret'),
      callbackURL: `${configService.get<string>(
        'baseUrl',
      )}${configService.get<string>('urlPrefix')}/auth/login/facebook/redirect`,
      scope: ['email', 'profile'],
      // passReqToCallback:true
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: StrategyFacebookProfile,
    done: any,
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
      throw new Error(
        'No verified email returned from Facebook Authorization!',
      );
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
