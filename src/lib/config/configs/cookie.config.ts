import { ConfigService } from '@nestjs/config';
import type { CookieOptions } from 'express-session';

export const getCookieOptions = (
  configService: ConfigService,
): CookieOptions => {
  return {
    httpOnly: true,
    signed: true,
    sameSite: 'strict',
    secure: configService.get<boolean>('isProd'),
    domain: configService.get<string | undefined>('session.cookieDomain'), // .example.com || undefined
    path: '/',
  };
};
