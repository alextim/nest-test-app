import { Body, Controller, Get, Post, Query, HttpCode } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { UserNotFoundException } from '../users/users.error';
import { UsersService } from '../users/users.service';

import { ProfileService } from './profile.service';

import { SendEmailVerificationDto } from './dto/send-email-verification.dto';
import { SendEmailVerificationLinkDto } from './dto/send-email-verification-link.dto';
import { SendPasswordResetDto } from './dto/send-password-reset.dto';
import { SignupDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('signup')
  async signup(@Body() newUser: SignupDto) {
    await this.profileService.signup(newUser);
    return `Verification token sent to ${newUser.email}. Check your email to complete registration`;
  }

  @Get('send_email_verification_link')
  async sendEmailVerificationLink(
    @Query() { email }: SendEmailVerificationLinkDto,
  ) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    await this.profileService.createTokenAndSendVerificationLink(user);
    return `E-mail verification link sent to ${user.email}.`;
  }

  @Get('verify_email')
  async verifyEmail(@Query() { token }: SendEmailVerificationDto) {
    await this.profileService.verifyEmailByToken(token);
    return 'Email address is verified';
  }

  @Get('send_new_verification_link')
  async sendNewVerificationLink(
    @Query() { token: oldToken }: SendEmailVerificationDto,
  ) {
    await this.profileService.sendNewVerificationLink(oldToken);
    return 'New verification token sent';
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(200)
  @Post('send_password_reset_token')
  async sendPasswordResetToken(@Body() { email }: SendPasswordResetDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }
    await this.profileService.sendPasswordResetToken(email);
    return 'Check your email for reset instructions';
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @HttpCode(200)
  @Post('reset_password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.profileService.resetPasswordByToken(dto);
    return 'New password set';
  }
}
