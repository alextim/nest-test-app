import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';

import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleAuthService } from './google-auth.service';
import { GoogleLoginGuard } from './guards/google-login.guard';

@Controller('google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  async signInWithGoogle(@Req() _req) {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  signInWithGoogleRedirect(@Req() req) {
    return this.googleAuthService.googleLogin(req);
  }
}
