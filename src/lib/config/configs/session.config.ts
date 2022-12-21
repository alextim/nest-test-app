import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import type { SessionOptions } from 'express-session';
import connectPgSimple from 'connect-pg-simple';
// import { createClient } from 'redis';
// import * as createRedisStore from 'connect-redis';

import { getCookieOptions } from './cookie.config';

export const getSessionOptions = (
  configService: ConfigService,
): SessionOptions => {
  // const RedisStore = createRedisStore(session);
  // const redisClient = createClient({
  //   host: configService.get<string>('REDIS_HOST'),
  //   port: configService.get<number>('REDIS_PORT')
  // });
  // store = new RedisStore({ client: redisClient });

  const store = configService.get<boolean>('isProd')
    ? new (connectPgSimple(session))()
    : new session.MemoryStore();

  return {
    secret: configService.get<string>('session.secret'),
    resave: false,
    // https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session
    saveUninitialized: false,
    store,
    name: configService.get<string>('session.name'),
    cookie: getCookieOptions(configService),
  };
};
