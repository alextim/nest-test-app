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
import { getCookieOptions } from '../../lib/config/configs/cookie.config';

import RequestWithUser from './interfaces/requestWithUser.interface';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import { LoginGuard } from './guards/login.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @HttpCode(200)
  @UseInterceptors(ExcludeNullInterceptor)
  @UseGuards(LoginGuard)
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
    });
  }

  @HttpCode(200)
  @UseGuards(CookieAuthGuard)
  @Post('test')
  async test(@Req() req: RequestWithUser) {
    // TODO:
    (req as any).logOut();
    return req.user;
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

  @Get('login/google')
  @UseGuards(LoginGuard)
  async signInWithGoogle() {
    // Guard redirects
  }

  @Get('login/google/redirect')
  @UseGuards(LoginGuard)
  signInWithGoogleRedirect(@Req() req) {
    if (!req.user) {
      return 'No user from Google';
    }

    return {
      message: 'User information from Google',
      user: req.user,
    };
  }

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
}
