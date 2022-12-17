import { ConfigService } from '@nestjs/config';
import type { CookieOptions } from 'express-session';

export const getCookieOptions = (
  configService: ConfigService,
): CookieOptions => {
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const domain = configService.get('SESSION_COOKIE_DOMAIN') || undefined;
  return {
    httpOnly: true,
    signed: true,
    sameSite: 'strict',
    secure: isProd,
    domain,
    path: '/',
  };
};
