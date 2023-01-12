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
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { getDataSourceOptions } from './src/lib/orm/datasource.options';

config();
 
const configService = new ConfigService();

const dataSourceOptions = {
  ...getDataSourceOptions(configService) as any,

  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  database: configService.get<string>('DB_NAME'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),  

  entities: ['src/**/*.entity.ts'],
  autoLoadEntities: true,
  /** 2) add reference to generated class here */
  migrations: [],
};
export default new DataSource(dataSourceOptions);
