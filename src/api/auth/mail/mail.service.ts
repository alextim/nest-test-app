import path from 'node:path';
import { ConfigService } from '@nestjs/config';
import humanizeDuration from 'humanize-duration';

import MailProvider from '../../../services/mail/implementation/MailProvider';

import { User } from '../../users/entities/user.entity';
import { TokenType } from '../entities/token.entity';
import { Inject } from '@nestjs/common';

export default class MailService {
  // @Inject(ConfigService) private readonly config: ConfigService;
  @Inject(MailProvider) private readonly mailProvider: MailProvider;

  constructor( @Inject(ConfigService) private readonly config: ConfigService) { }
  
  private getHumanizedTTL(key: string) {
    return humanizeDuration(this.config.get<number>(key));
  }

  private getLink(path: string, token: string) {
    const baseUrl = this.config.get<string>('BASE_URL');
    const link = `${baseUrl}/api/v1/auth/${path}?token=${token}`;
    return link;
  }

  async sendVerificationToken(user: User, token: string) {
    const ttl = this.getHumanizedTTL('EMAIL_VERIFICATION_TOKEN_TTL'); 
    await this.send(user,
      TokenType.EmailVerification,
      { link: this.getLink('verify_email', token) },
      `Your account verification code (valid for only ${ttl}) `,
    );
  }

  async sendPasswordResetToken(user: User, token: string) {
    const ttl = this.getHumanizedTTL('PASSWORD_RESET_TOKEN_TTL');
    await this.send(user,
      TokenType.PasswordReset,
      { link: this.getLink('reset_password', token) },
      `Your one-time password reset code (valid for only ${ttl})`,
    );
  }

  private async send(
    user: User,
    template: string,
    variables: Record<string, string | number>,
    subject: string,
  ) {
    const appName = this.config.get<string>('APP_NAME');

    const name = user.getFullName();
    const email = user.email;    

    const file = path.join(__dirname, 'templates', `${template}.hbs`);

    await this.mailProvider.sendEmail({
      to: {
        name,
        email,
      },
      subject: `[${appName}] ${subject}`,
      templateData: {
        file,
        variables: { ...variables, appName },
      },
    });
  }
}
