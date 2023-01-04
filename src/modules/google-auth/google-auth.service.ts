import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: this.clientId,
      });
      const payload = loginTicket.getPayload();
      return payload;
    } catch (err: unknown) {
      throw new UnauthorizedException(err);
    }
  }

  async authenticate(token: string) {
    const payload = await this.verifyGoogleToken(token);

    if (!payload) {
      throw new UnauthorizedException('No data from Google');
    }

    const {
      email,
      email_verified: emailVerified,
      given_name: firstName,
      family_name: lastName,
      // profile,
      picture,
      sub: googleId,
    } = payload;

    if (!email) {
      throw new UnauthorizedException('No email from Google');
    }

    if (!emailVerified) {
      throw new UnauthorizedException('Email not verified by Google');
    }

    let user = await this.usersService.findByEmail(email);
    if (user) {
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
        const avatarId = await this.downloadAvatar(picture);
        if (avatarId) {
          needUpdate = true;
          user.avatarId = avatarId;
        }
      }
      if (needUpdate) {
        await this.usersService.save(user);
      }
    } else {
      const avatarId = await this.downloadAvatar(picture);
      user = await this.usersService.create({
        lastName,
        firstName,
        email,
        isRegisteredWithGoogle: true,
        googleId,
        avatarId,
        verifiedAt: new Date(),
      });
    }

    return user;
  }

  private async downloadAvatar(picture: string) {
    try {
      const { id } = await this.localFilesService.download(picture, 'avatar');
      return id;
    } catch (err) {
      console.error(err);
    }
  }
}
