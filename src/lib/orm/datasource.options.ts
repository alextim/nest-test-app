import { ConfigService } from '@nestjs/config';
import type { DataSourceOptions } from 'typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { CustomNamingStrategy } from './CustomNamingStrategy';

export const getDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  schema: 'public',
  ...configService.get<PostgresConnectionOptions>('db'),
  namingStrategy: new CustomNamingStrategy(),
});
