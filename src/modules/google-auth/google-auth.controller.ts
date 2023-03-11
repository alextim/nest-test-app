import { Req, Controller, Res, UseGuards, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import { LoginGuard } from '../auth/guards/login.guard';
import { GOOGLE_REDIRECT_PATH } from './google-auth.constants';

@Controller()
export class GoogleAuthController {
  constructor(private readonly configService: ConfigService) {}
  @Get('auth/login/google')
  @UseGuards(LoginGuard)
  async signInWithGoogle() {
    // Guard redirects
  }

  @Get(GOOGLE_REDIRECT_PATH)
  @UseGuards(LoginGuard)
  signInWithGoogleRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    const frontendAppUrl = this.configService.get<string>('frontendAppUrl');
    const url = req.user ? frontendAppUrl : `${frontendAppUrl}/login`;
    res.redirect(url);
  }
}
