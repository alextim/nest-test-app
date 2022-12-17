import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { getDataSourceOptions } from './datasource.options';

export const getTypeOrmOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  ...getDataSourceOptions(configService),
  // entities: ['dist/**/*.entity.{ts,js}'],
  entities: [],
  autoLoadEntities: true,
  migrations: ['dist/migrations/**/*.{ts,js}'],
  subscribers: ['dist/subscriber/**/*.{ts,js}'],

  migrationsTableName: 'typeorm_migrations',
  logger: 'file',
  synchronize: true, // never use TRUE in production!
});
