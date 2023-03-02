import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import { getDataSourceOptions } from '../src/lib/orm/datasource.options';
import { SeedTimezone2617378125500 } from './timezone/SeedTimezone2617378125500';
import { SeedSession2617378125501 } from './session/SeedSession2617378125501';

config();

const configService = new ConfigService();

const dataSourceOptions = {
  ...(getDataSourceOptions(configService) as any),

  url: configService.get<string>('DATABASE_URL'),

  entities: ['src/**/*.entity.ts'],
  autoLoadEntities: true,
  migrations: [SeedTimezone2617378125500, SeedSession2617378125501],
};
export default new DataSource(dataSourceOptions);
