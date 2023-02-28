import {
  Req,
  Res,
  Next,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  Get,
} from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

import type {
  Response,
  Request,
  NextFunction /*, CookieOptions */,
} from 'express';

import { ExcludeNullInterceptor } from '../../interceptors/exclude-null';
// import { getCookieOptions } from '../../lib/config/configs/cookie.config';

import RequestWithUser from './interfaces/requestWithUser.interface';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import { LoginGuard } from './guards/login.guard';

@Controller('auth')
// @UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  // constructor(private readonly configService: ConfigService) {}

  @HttpCode(200)
  @UseInterceptors(ExcludeNullInterceptor)
  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(CookieAuthGuard)
  @Get('me')
  async me(@Req() req: RequestWithUser) {
    return req.user;
  }

  @UseGuards(CookieAuthGuard)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.end();
      /*
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.cookie(this.configService.get<string>('session.cookieName'), '', {
          ...(getCookieOptions(this.configService) as CookieOptions),
          maxAge: 0,
          expires: new Date(1),
          signed: false,
        });

        // redirect to homepage
        // res.redirect('/');

        res.end();
      });
      */
    });
  }

  /*
  @Get('login/facebook')
  @UseGuards(LoginGuard)
  async signInWithFacebook() {
    // Guard redirects
  }

  @Get('login/facebook/redirect')
  @UseGuards(LoginGuard)
  signInWithFacebookRedirect(@Req() req) {
    if (!req.user) {
      return 'No user from facebook';
    }

    return {
      message: 'User information from facebook',
      user: req.user,
    };
  }
  */
}
