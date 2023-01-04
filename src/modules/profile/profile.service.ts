import {
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import humanizeDuration from 'humanize-duration';

import { MailService } from '../../mail/mail.service';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { TokenType } from './entities/token.entity';
import { TokensService } from './tokens.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly mailService: MailService,
  ) {}
  public async signup(signupDto: SignupDto) {
    const user = await this.usersService.create(signupDto);
    await this.createTokenAndSendVerificationLink(user);
  }

  public async createTokenAndSendVerificationLink(user: User) {
    const token = await this.tokensService.createEmailVerificationToken(
      user.id,
    );

    await this.send(
      user,
      TokenType.EmailVerification,
      {
        verifyEmailLink: this.getLink('verify_email', token),
        sendNewVerificationLink: this.getLink(
          'send_new_verification_link',
          token,
        ),
      },
      `Your account verification code (valid for only ${this.getHumanizedTTL(
        'auth.emailVerificationTokenTTL',
      )}) `,
    );

    await this.usersService.setVerificationCodeSentAt(user);
  }

  private getHumanizedTTL(key: string) {
    return humanizeDuration(this.configService.get<number>(key));
  }

  private getLink(path: string, token: string) {
    const baseUrl = this.configService.get<string>('baseUrl');
    const urlPrefix = this.configService.get<string>('urlPrefix');
    return `${baseUrl}${urlPrefix}/profile/${path}?token=${token}`;
  }

  private async send(
    user: User,
    template: string,
    params: Record<string, string | number>,
    subject: string,
  ) {
    const appName = this.configService.get<string>('appName');

    const name = user.fullName || user.username || user.email;
    const email = user.email;

    await this.mailService.sendEmail({
      to: {
        name,
        email,
      },
      subject: `[${appName}] ${subject}`,
      template: {
        filename: template,
        params: { ...params, appName },
      },
    });
  }

  async verifyEmailByToken(tokenValue: string) {
    const token = await this.tokensService.findEmailVerificationToken(
      tokenValue,
    );
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    if (token.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    const user = await this.usersService.findById(token.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.verifiedAt) {
      throw new ForbiddenException('User already verified');
    }

    await this.usersService.setVerifiedAt(user);
    await this.tokensService.expire(token.id);
  }

  async sendNewVerificationLink(oldToken: string) {
    const token = await this.tokensService.findEmailVerificationToken(oldToken);
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    const user = await this.usersService.findById(token.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.verifiedAt) {
      throw new ForbiddenException('User already verified');
    }

    await this.createTokenAndSendVerificationLink(user);
    await this.tokensService.expire(token.id);
  }

  async sendPasswordResetToken(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = await this.tokensService.createPasswordResetToken(user.id);

    try {
      await this.send(
        user,
        TokenType.PasswordReset,
        { link: this.getLink('reset_password', token) },
        `Your one-time password reset code (valid for only ${this.getHumanizedTTL(
          'auth.passwordResetTokenTTL',
        )})`,
      );
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async resetPasswordByToken({
    token: tokenValue,
    password: plainPassword,
  }: ResetPasswordDto) {
    const token = await this.tokensService.findPasswordResetToken(tokenValue);
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    if (token.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    const user = await this.usersService.findById(token.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.verifiedAt) {
      throw new ForbiddenException('User not verified');
    }

    await this.usersService.updatePassword(user, plainPassword);
    await this.tokensService.expire(token.id);
  }
}
