import { ConfigService } from '@nestjs/config';
import type { DataSourceOptions } from 'typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { CustomNamingStrategy } from './CustomNamingStrategy';

export const getDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  schema: 'public',
  url: configService.get<string>('databaseUrl'),
  namingStrategy: new CustomNamingStrategy(),
});
