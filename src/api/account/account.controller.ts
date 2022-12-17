import {
  Body,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Post,
  Query,
  HttpCode,
} from '@nestjs/common';
import { AccountService } from './account.service';

import { AccountDto } from './dto/email-verification.dto';
import { SendPasswordResetDto } from './dto/send-password-reset.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('account')
@UseInterceptors(ClassSerializerInterceptor)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @HttpCode(200)
  @Post('signup')
  async signup(@Body() newUser: SignupDto) {
    await this.accountService.signup(newUser);
    return `Verification token sent to ${newUser.email}. Check your email to complete registration`;
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
    await this.accountService.sendPasswordResetToken(email);
    return `Password reset token sent to ${email}. Check your email`;
  }
}
