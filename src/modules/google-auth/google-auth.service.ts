import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TokenPayload } from 'google-auth-library';
import { OAuth2Client } from 'google-auth-library';

import LocalFilesService from '../local-files/local-files.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleAuthService {
  private readonly oauthClient: OAuth2Client;
  private readonly clientId: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly localFilesService: LocalFilesService,
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
    const {
      email,
      given_name: firstName,
      family_name: lastName,
      // profile,
      picture,
      sub: googleId,
    } = await this.verifyGoogleToken(token);

    if (await this.usersService.emailExists(email)) {
      throw new UnauthorizedException('Already registered');
    }

    const avatarId = await this.downloadAvatar(picture, email.split('@')[0]);

    const user = await this.usersService.create({
      lastName,
      firstName,
      email,
      isRegisteredWithGoogle: true,
      googleId,
      avatarId,
      verifiedAt: new Date(),
    });

    return user;
  }

  async authenticate(token: string) {
    const {
      email,
      given_name: firstName,
      family_name: lastName,
      // profile,
      picture,
      sub: googleId,
    } = await this.verifyGoogleToken(token);

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not registered');
    }

    let needUpdate = false;
    if (!user.lastName && lastName) {
      needUpdate = true;
      user.lastName = lastName;
    }
    if (!user.firstName && firstName) {
      needUpdate = true;
      user.lastName = firstName;
    }
    if (!user.googleId) {
      needUpdate = true;
      user.googleId = googleId;
    }
    if (!user.verifiedAt) {
      needUpdate = true;
      user.verifiedAt = new Date();
    }
    if (!user.avatarId && picture) {
      const avatarId = await this.downloadAvatar(picture, email.split('@')[0]);
      if (avatarId) {
        needUpdate = true;
        user.avatarId = avatarId;
      }
    }
    
    if (needUpdate) {
      await this.usersService.save(user);
    }

    return user;
  }

  private async downloadAvatar(picture: string, name: string) {
    const AVATARS_DIR = 'avatars';
    try {
      const { id: fileId } = await this.localFilesService.download(picture, name, AVATARS_DIR);
      return fileId;
    } catch (err) {
      console.error(err);
    }
  }
}
