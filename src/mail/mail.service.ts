import path from 'node:path';
import fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import handlebars from 'handlebars';

import SendMailDto from './providers/dto/SendMail.dto';

@Injectable()
export class MailService {
  private readonly client: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    const mailConfig = {
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      auth: {
        user: this.configService.get<string>('mail.username'),
        pass: this.configService.get<string>('mail.password'),
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
        name: from?.name || this.configService.get<string>('mail.fromName'),
        address:
          from?.email || this.configService.get<string>('mail.fromEmail'),
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    };

    const info = await this.client.sendMail(mailOptions);
    this.logger.debug('Message sent  %o', info);

    if (this.configService.get<boolean>('isDev')) {
      // Preview only available when sending through an Ethereal account
      this.logger.log('Message sent: %s', info.messageId);
      this.logger.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } else {
      this.logger.log('Message sent to: %s %o', to.email, info.response);
    }
  }
}
