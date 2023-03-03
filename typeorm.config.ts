/**
 * https://github.com/typeorm/typeorm/issues/8762
 * 
 * https://wanago.io/2022/07/25/api-nestjs-database-migrations-typeorm/
 * 
 * 1) npm run typeorm:generate-migration --name={YourClassName}
 * 2) import the migration classes manually 
 *    - add reference to migration: [...]
 *    - import generated class from ./migration
 * 3) npm run typeorm:run-migrations
 * 
 * npm run typeorm:revert-migration
 */
import { DataSource } from 'typeorm';
import 'dotenv/config';

import { getDataSourceOptions } from './src/lib/orm/datasource.options';

import { SeedTimezone2617378125502 } from './seed/timezone/SeedTimezone2617378125502';
// import { SeedSession2617378125501 } from './seed/SeedSession2617378125501';

const dataSourceOptions = {
  ...getDataSourceOptions(),

  entities: ['src/**/*.entity.ts'],
  autoLoadEntities: true,
  /** 2) add reference to generated class here */
  migrations: [
    SeedTimezone2617378125502
    // SeedSession2617378125501
  ],
};
export default new DataSource(dataSourceOptions);
