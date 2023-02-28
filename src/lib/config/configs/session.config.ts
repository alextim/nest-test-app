import { ConfigService } from '@nestjs/config';
import session, { Store } from 'express-session';
import type { SessionOptions } from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
// import { createClient } from 'redis';
// import * as createRedisStore from 'connect-redis';

import { getCookieOptions } from './cookie.config';

const getConnectionString = (configService: ConfigService) => {
  const host = configService.get<string>('db.host');
  const port = configService.get<number>('db.port');
  const database = configService.get<string>('db.database');
  const username = configService.get<string>('db.username');
  const password = configService.get<string>('db.password');
  return `postgresql://${username}:${password}@${host}:${port}/${database}`;
};

export const getSessionOptions = (
  configService: ConfigService,
): SessionOptions => {
  /*
  // Redis
  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT')
  });
  store = new RedisStore({ client: redisClient });
  */


  let store: Store;
  
  if (configService.get<boolean>('isDev')) {
    store = new session.MemoryStore();
  } else {
    store = new (connectPgSimple(session))({
      pg,
      conString: getConnectionString(configService),
      tableName: 'session',
      schemaName: 'public'
    });
  }

  return {
    secret: configService.get<string>('session.secret'),
    resave: false,
    // https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session
    saveUninitialized: false,
    store,
    name: configService.get<string>('session.cookieName'),
    cookie: getCookieOptions(configService),
  };
};
