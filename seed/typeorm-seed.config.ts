import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { CustomNamingStrategy } from '../src/lib/orm/CustomNamingStrategy';
import { SeedTimezone2617378125500 } from './timezone/SeedTimezone2617378125500';
import { SeedSession2617378125501 } from './session/SeedSession2617378125501';

config();

console.log('process.env.DATABASE_URL', process.env.DATABASE_URL)

export default new DataSource({
  type: 'postgres',
  schema: 'public',
  url: process.env.DATABASE_URL,
  namingStrategy: new CustomNamingStrategy(),

  entities: ['src/**/*.entity.ts'],
  migrations: [SeedTimezone2617378125500, SeedSession2617378125501],
});
