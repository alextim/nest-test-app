import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '../IMailProvider';
import IMailTemplateProvider from '../IMailTemplateProvider';
import SendMailDto from '../dto/SendMail.dto';
import HandlebarsMailTemplateProvider from './HandlebarsMailTemplateProvider';

export default class MailProvider implements IMailProvider {
  private client: Transporter;

  mailTemplateProvider: IMailTemplateProvider;

  constructor() {
    this.mailTemplateProvider = new HandlebarsMailTemplateProvider();

    const mailConfig = {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_POST, 10),
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    };

    this.client = nodemailer.createTransport(mailConfig);
  }

  public async sendEmail({
    to,
    from,
    subject,
    templateData,
  }: SendMailDto): Promise<void> {
    const defaultName = process.env.MAIL_FROM_NAME;
    const defaultEmail = process.env.MAIL_FROM_EMAIL;

    const html = await this.mailTemplateProvider.parse(templateData);

    const mailOptions = {
      from: {
        name: from?.name || defaultName,
        address: from?.email || defaultEmail,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    };

    await this.client.sendMail(mailOptions);
  }
}
