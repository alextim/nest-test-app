import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { SignupDto } from './dto/signup.dto';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { SendPasswordResetDto } from './dto/send-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import RequestWithUser from './requestWithUser.interface';
import { CookieAuthenticationGuard } from './guards/cookieAuthentication.guard';
import { LogInWithCredentialsGuard } from './guards/logInWithCredentials.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() newUser: SignupDto) {
    await this.authService.signup(newUser);
    return `Verification token sent to ${newUser.email}. Check your email to complete registration`;
  }

  @Get('verify_email')
  async verifyEmail(@Query() { token }: EmailVerificationDto) {
    await this.authService.verifyEmailByToken(token);
    return 'Email address is verified';
  }

  @Get('send_password_reset')
  async sendPasswordResetToken(@Query() { email }: SendPasswordResetDto) {
    await this.authService.sendPasswordResetToken(email);
    return `Password reset token sent to ${email}. Check your email`;
  }

  @Get('reset_password')
  async resetPassword(@Query() dto: ResetPasswordDto) {
    await this.authService.resetPasswordByToken(dto);
    return 'New password successfully set';
  }

  @HttpCode(200)
  @UseGuards(LogInWithCredentialsGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Get('authenticate')
  async authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Post('logout')
  async logout(@Req() request: RequestWithUser) {
    // request.logOut();
    request.session.cookie.maxAge = 0;
  }

  @HttpCode(200)
  @UseGuards(CookieAuthenticationGuard)
  @Post('test')
  async test(@Req() request: RequestWithUser) {
    // request.logOut();
    return request.user;
  }  
}
