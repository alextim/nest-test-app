import nodemailer, { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

import IMailProvider from '../IMailProvider';
import IMailTemplateProvider from '../IMailTemplateProvider';
import SendMailDto from '../dto/SendMail.dto';
import HandlebarsMailTemplateProvider from './HandlebarsMailTemplateProvider';

@Injectable()
export default class MailProvider implements IMailProvider {
  private readonly client: Transporter;
  private readonly mailTemplateProvider: IMailTemplateProvider;

  constructor(private readonly config: ConfigService) {
    this.mailTemplateProvider = new HandlebarsMailTemplateProvider();

    const mailConfig = {
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_POST'),
      auth: {
        user: this.config.get<string>('MAIL_USERNAME'),
        pass: this.config.get<string>('MAIL_PASSWORD'),
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
    const html = await this.mailTemplateProvider.parse(templateData);

    const mailOptions = {
      from: {
        name: from?.name || this.config.get<string>('MAIL_FROM_NAME'),
        address: from?.email || this.config.get<string>('MAIL_FROM_EMAIL'),
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    };

    const info = await this.client.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
