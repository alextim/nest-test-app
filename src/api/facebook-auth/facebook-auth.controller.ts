import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';

import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { FacebookAuthService } from './facebook-auth.service';
import { FacebookLoginGuard } from './guards/facebook-login.guard';

@Controller('facebook')
export class FacebookAuthController {
  constructor(private readonly facebookAuthService: FacebookAuthService) {}

  @Get()
  @UseGuards(FacebookAuthGuard)
  async signInWithFacebook(@Req() req) {
    return this.facebookAuthService.facebookLogin(req);
  }

  //@Get('redirect')
  //@UseGuards(FacebookAuthGuard)
  signInWithFacebookRedirect(@Req() req) {
    return this.facebookAuthService.facebookLogin(req);
  }
}
