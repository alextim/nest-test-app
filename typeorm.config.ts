/**
 * https://github.com/typeorm/typeorm/issues/8762
 * 
 * https://wanago.io/2022/07/25/api-nestjs-database-migrations-typeorm/
 * 
 * 1) npm run typeorm:generate-migration --name={YourClassName}
 * 2) npm run typeorm:run-migrations
 * 
 * npm run typeorm:revert-migration
 */
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { getDataSourceOptions } from './src/lib/orm/datasource.options';

import { FacebookAuth1671309913319 } from './migrations/1671309913319-FacebookAuth';

config();
 
const configService = new ConfigService();

const dataSourceOptions = {
  ...getDataSourceOptions(configService),
  entities: ['src/**/*.entity.ts'],
  autoLoadEntities: true,
  migrations: [FacebookAuth1671309913319],
};
export default new DataSource(dataSourceOptions);
