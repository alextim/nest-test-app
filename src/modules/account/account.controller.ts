import { Body, Controller, Get, Post, Query, HttpCode } from '@nestjs/common';
import { UserNotFoundException } from '../users/users.error';
import { UsersService } from '../users/users.service';
import { AccountService } from './account.service';

import { AccountDto } from './dto/email-verification.dto';
import { SendEmailVerificationLinkDto } from './dto/send-email-verification-link.dto';
import { SendPasswordResetDto } from './dto/send-password-reset.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService, private readonly usersService: UsersService) {}
  @HttpCode(200)
  @Post('signup')
  async signup(@Body() newUser: SignupDto) {
    await this.accountService.signup(newUser);
    return `Verification token sent to ${newUser.email}. Check your email to complete registration`;
  }

  @HttpCode(200)
  @Get('send_email_verification_link')
  async sendEmailVerificationLink(@Query() { email }: SendEmailVerificationLinkDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    await this.accountService.createTokenAndSendVerificationLink(user);
    return `E-mail verification link sent to ${user.email}.`;
  }

  @Get('verify_email')
  async verifyEmail(@Query() { token }: AccountDto) {
    await this.accountService.verifyEmailByToken(token);
    return 'Email address is verified';
  }

  @Get('send_new_verification_link')
  async sendNewVerificationLink(@Query() { token: oldToken }: AccountDto) {
    await this.accountService.sendNewVerificationLink(oldToken);
    return 'New verification token sent';
  }

  @Get('send_password_reset_token')
  async sendPasswordResetToken(@Query() { email }: SendPasswordResetDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }    
    await this.accountService.sendPasswordResetToken(email);
    return `Password reset token sent to ${email}. Check your email`;
  }
}
