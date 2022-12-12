import path from 'node:path';
import { User } from './entities/user.entity';
import MailProvider from '../../services/mail/implementation/MailProvider';

export default class MailService {
  private readonly mailProvider = new MailProvider();
  private readonly name: string;
  private readonly email: string;

  constructor(public user: User) {
    this.name = user.firstName || user.lastName || user.username || user.email;
    this.email = user.email;
  }

  async sendVerificationCode() {
    await this.send(
      'email_verification',
      { link: 111 },
      'Your account verification code',
    );
  }

  async sendPasswordResetToken() {
    await this.send(
      'password_reset',
      { link: 123 },
      'Your password reset token (valid for only 10 minutes)',
    );
  }

  private async send(
    template: string,
    variables: Record<string, string | number>,
    subject: string,
  ) {
    const appName = process.env.APP_NAME;

    const file = path.resolve(__dirname, 'views', `${template}.hbs`);

    await this.mailProvider.sendEmail({
      to: {
        name: this.name,
        email: this.email,
      },
      subject: `[${appName}] ${subject}`,
      templateData: {
        file,
        variables: { ...variables, appName },
      },
    });
  }
}
