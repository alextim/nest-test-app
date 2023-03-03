import { DataSource } from 'typeorm';
import 'dotenv/config';

import { getDataSourceOptions } from '../src/lib/orm/datasource.options';

import { CreateTimezone2617378125500 } from './timezone/CreateTimezone2617378125500';
import { SeedTimezone2617378125502 } from './timezone/SeedTimezone2617378125502';
import { CreateSession2617378125501 } from './session/CreateSession2617378125501';

export default new DataSource({
  ...getDataSourceOptions(),

  entities: ['src/**/*.entity.ts'],
  migrations: [
    CreateTimezone2617378125500,
    SeedTimezone2617378125502,
    CreateSession2617378125501,
  ],
});
