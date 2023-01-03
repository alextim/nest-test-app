import { Body, Req, Controller, HttpCode, Post, Next, Res } from '@nestjs/common';
import type { Response, Request, NextFunction } from 'express';

import { UserMapper } from '../users/user-mapper';

import { GoogleAuthDto } from './dto/google-auth.dto';
import { GoogleAuthService } from './google-auth.service';

@Controller()
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) { }

  @HttpCode(200)
  @Post('auth/login-with-google')
  async loginWithGoogle(@Body() { token }: GoogleAuthDto,
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction) {
    const user = await this.googleAuthService.authenticate(token);
    const dto = UserMapper.toDto(user);
    (req as any).login(dto, (err) => { 
      if (err) {
        return next(err);
      }
      res.end(JSON.stringify(dto));
    });  
  }
}
