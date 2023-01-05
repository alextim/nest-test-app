import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  Next,
  Res,
} from '@nestjs/common';
import type { Response, Request, NextFunction } from 'express';

import { UserMapper } from '../users/user-mapper';

import { GoogleAuthDto } from './dto/google-auth.dto';
import { GoogleSignupDto } from './dto/google-signup.dto';
import { GoogleAuthService } from './google-auth.service';

@Controller()
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @HttpCode(200)
  @Post('auth/login/google')
  async login(
    @Body() { token }: GoogleAuthDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const user = await this.googleAuthService.authenticate(token);

    const dto = UserMapper.toDto(user);
    /**
     *  passport login
     */
    (req as any).login(dto, (err) => {
      if (err) {
        return next(err);
      }
      res.end(JSON.stringify(dto));
    });
  }

  @HttpCode(200)
  @Post('profile/signup/google')
  async signup(@Body() { token }: GoogleSignupDto) {
    await this.googleAuthService.signup(token);
  }  
}
