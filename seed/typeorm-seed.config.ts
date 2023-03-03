import { DataSource } from 'typeorm';
import 'dotenv/config';

import { CustomNamingStrategy } from '../src/lib/orm/CustomNamingStrategy';

import { CreateTimezone2617378125500 } from './timezone/CreateTimezone2617378125500';
import { SeedTimezone2617378125502 } from './timezone/SeedTimezone2617378125502';
import { CreateSession2617378125501 } from './session/CreateSession2617378125501';

export default new DataSource({
  type: 'postgres',
  schema: 'public',
  url: process.env.DATABASE_URL,
  namingStrategy: new CustomNamingStrategy(),

  entities: ['src/**/*.entity.ts'],
  migrations: [
    CreateTimezone2617378125500,
    SeedTimezone2617378125502,
    CreateSession2617378125501,
  ],
});
