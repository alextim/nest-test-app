import type { DataSourceOptions } from 'typeorm';

import { CustomNamingStrategy } from './CustomNamingStrategy';

export const getDataSourceOptions = (): DataSourceOptions => ({
  type: 'postgres',
  schema: 'public',
  url: process.env.DATABASE_URL,
  namingStrategy: new CustomNamingStrategy(),
});
