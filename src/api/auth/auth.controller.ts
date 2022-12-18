import {
  Req,
  Res,
  Next,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Response, Request, NextFunction, CookieOptions } from 'express';

import { ExcludeNullInterceptor } from '../../interceptors/excludeNull.interceptor';
import { getCookieOptions } from '../../config/cookie.config';

import { AuthService } from './auth.service';

import RequestWithUser from './interfaces/requestWithUser.interface';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import { LocalLoginGuard } from './guards/local-login.guard';
import { AdminGuard } from './guards/admin.guard';
import { GoogleLoginGuard } from './guards/google-login.guard';
import { FacebookLoginGuard } from './guards/facebook-login.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(200)
  @UseInterceptors(ExcludeNullInterceptor)
  @UseGuards(LocalLoginGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(200)
  @UseGuards(CookieAuthGuard)
  @Get('authenticate')
  async authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }

  @UseGuards(CookieAuthGuard)
  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): Promise<void> {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.cookie(this.configService.get('SESSION_COOKIE_NAME'), '', {
          ...(getCookieOptions(this.configService) as CookieOptions),
          maxAge: 0,
          expires: new Date(1),
          signed: false,
        });

        // redirect to homepage
        // res.redirect('/');

        res.end();
      });
    });
  }

  @HttpCode(200)
  @UseGuards(CookieAuthGuard)
  @Post('test')
  async test(@Req() request: RequestWithUser) {
    // TODO:
    (request as any).logOut();
    return request.user;
  }

  @Get('public')
  publicRoute() {
    return 'public';
  }

  @UseGuards(CookieAuthGuard)
  @Get('protected')
  guardedRoute() {
    return 'protected';
  }

  @UseGuards(AdminGuard)
  @Get('admin')
  getAdminMessage() {
    return 'admin';
  }

  @Get('google')
  @UseGuards(GoogleLoginGuard)
  async signInWithGoogle(@Req() _) {
    // Guard redirects
  }

  @Get('google/redirect')
  @UseGuards(GoogleLoginGuard)
  signInWithGoogleRedirect(@Req() req) {
    if (!req.user) {
      return 'No user from Google';
    }

    return {
      message: 'User information from Google',
      user: req.user,
    };
  }

  @Get('facebook')
  @UseGuards(FacebookLoginGuard)
  async signInWithFacebook(@Req() _) {
    // Guard redirects
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookLoginGuard)
  signInWithFacebookRedirect(@Req() req) {
    if (!req.user) {
      return 'No user from facebook';
    }

    return {
      message: 'User information from facebook',
      user: req.user,
    };
  }
}
