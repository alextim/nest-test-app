import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import { getDataSourceOptions } from '../src/lib/orm/datasource.options';
import { SeedTimezone2617378125500 } from './timezone/SeedTimezone2617378125500';
import { SeedSession2617378125501 } from './session/SeedSession2617378125501';

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
  migrations: [
    SeedTimezone2617378125500,
    SeedSession2617378125501
  ],
};
export default new DataSource(dataSourceOptions);
