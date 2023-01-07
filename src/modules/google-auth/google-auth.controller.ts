import { Req, Controller, Res, UseGuards, Get } from '@nestjs/common';
import type { Response } from 'express';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';

import { GOOGLE_REDIRECT_PATH } from './constants';
import { LoginGuard } from '../auth/guards/login.guard';
@Controller()
export class GoogleAuthController {
  @Get('auth/login/google')
  @UseGuards(LoginGuard)
  async signInWithGoogle() {
    // Guard redirects
  }

  @Get(GOOGLE_REDIRECT_PATH)
  @UseGuards(LoginGuard)
  signInWithGoogleRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    if (!req.user) {
      res.redirect('/login');
    }
    res.redirect('/');
  }
}
