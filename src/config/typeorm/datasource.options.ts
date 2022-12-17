import { ConfigService } from '@nestjs/config';
import type { DataSourceOptions } from 'typeorm';
import { CustomNamingStrategy } from './CustomNamingStrategy';

export const getDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  schema: 'public',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  database: configService.get<string>('DB_NAME'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  namingStrategy: new CustomNamingStrategy(),
});
