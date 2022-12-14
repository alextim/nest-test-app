import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import type { SessionOptions } from 'express-session';
import connectPgSimple from 'connect-pg-simple';
// import { createClient } from 'redis';
// import * as createRedisStore from 'connect-redis';

export const getCookieSessionOptions = (
  configService: ConfigService,
): SessionOptions => {
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  // const RedisStore = createRedisStore(session);
  // const redisClient = createClient({
  //   host: configService.get<string>('REDIS_HOST'),
  //   port: configService.get<number>('REDIS_PORT')
  // });

  let store;
  if (isProd) {
    store = new (connectPgSimple(session))();
    // store = new RedisStore({ client: redisClient });
  } else {
    store = new session.MemoryStore();
  }

  return {
    secret: configService.get<string>('SESSION_SECRET'),
    resave: false,
    // https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
      secure: isProd,
    },
  };
  
};
