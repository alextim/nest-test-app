import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { use } from 'passport';

import { UserMapper } from '../users/user-mapper';
import { FacebookAuthService } from './facebook-auth.service';
import { StrategyFacebookProfile } from './interfaces/strategy-facebook-profile.interface';

import FacebookTokenStrategy = require('passport-facebook-token');

@Injectable()
export class FacebookStrategy {
  constructor(
    private readonly config: ConfigService,
    private readonly facebookAuthService: FacebookAuthService,
  ) {
    this.init();
  }

  init() {
    use(
      new FacebookTokenStrategy(
        {
          clientID: this.config.get<string>('FACEBOOK_APP_ID'),
          clientSecret: this.config.get<string>('FACEBOOK_APP_SECRET'),
        },
        async (
          _accessToken: string,
          _refreshToken: string,
          profile: any,
          done: any,
        ) => {
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

          const user = await this.facebookAuthService.findOrCreateUser({
            providerId,
            providerName,

            email: email.value,
            firstName: name?.givenName,
            lastName: name?.familyName,
            name: displayName,
            avatar: photos[0]?.value,
          });

          done(null, UserMapper.toDto(user));
        },
      ),
    );
  }
}
