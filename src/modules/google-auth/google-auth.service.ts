import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TokenPayload } from 'google-auth-library';
import { OAuth2Client } from 'google-auth-library';

import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleAuthService {
  private readonly oauthClient: OAuth2Client;
  private readonly clientId: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.clientId = this.configService.get<string>('auth.google.clientId');
    this.oauthClient = new OAuth2Client(
      this.clientId,
      this.configService.get<string>('auth.google.clientSecret'),
    );
  }

  private async verifyGoogleToken(token: string) {
    let payload: TokenPayload;

    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: this.clientId,
      });
      payload = loginTicket.getPayload();
    } catch (err: unknown) {
      throw new UnauthorizedException(err);
    }

    if (!payload) {
      throw new UnauthorizedException('No data from Google');
    }
    if (!payload.email) {
      throw new UnauthorizedException('No email from Google');
    }
    if (!payload.email_verified) {
      throw new UnauthorizedException('Email not verified by Google');
    }

    return payload;
  }

  async signup(token: string) {
    const payload = await this.verifyGoogleToken(token);

    let user = await this.usersService.findByEmail(payload.email)
    if (user) {
      if (user.verifiedAt) {
        throw new UnauthorizedException('Already registered');
      }

      return this.usersService.updateUserFromGooglePayload(user, payload);
    }

    const avatarId = await this.usersService.downloadAvatarFromUrl(payload.picture, payload.email.split('@')[0]);

    return this.usersService.create({
      lastName: payload.family_name,
      firstName: payload.given_name,
      email: payload.email,
      isRegisteredWithGoogle: true,
      googleId: payload.sub,
      avatarId,
      verifiedAt: new Date(),
    });
  }

  async authenticate(token: string) {
    const payload  = await this.verifyGoogleToken(token);

    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    return this.usersService.updateUserFromGooglePayload(user, payload);
  }
}
