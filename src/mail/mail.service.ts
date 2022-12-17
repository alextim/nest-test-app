import path from 'node:path';
import fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import handlebars from 'handlebars';

import SendMailDto from './providers/dto/SendMail.dto';

@Injectable()
export class MailService {
  private readonly client: Transporter;
  constructor(private readonly config: ConfigService) {
    const mailConfig = {
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
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
    template: { filename, params },
  }: SendMailDto): Promise<void> {
    const file = path.join(__dirname, 'templates', `${filename}.hbs`);
    const templateFileContent = await fs.readFile(file, { encoding: 'utf-8' });
    const html = await handlebars.compile(templateFileContent)(params);

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
