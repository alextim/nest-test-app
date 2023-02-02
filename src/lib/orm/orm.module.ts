import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { getDataSourceOptions } from './datasource.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        ...getDataSourceOptions(configService),
        // entities: ['dist/**/*.entity.{ts,js}'],
        entities: [],
        autoLoadEntities: true,
        migrations: ['dist/migrations/**/*.{ts,js}'],
        subscribers: ['dist/subscriber/**/*.{ts,js}'],

        migrationsTableName: 'typeorm_migrations',
        synchronize: configService.get<boolean>('isDev'), // never use TRUE in production!

        // logger settings
        ...(configService.get('typeorm') as any),
      }),
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      //dataSourceFactory: async (options) => new DataSource(options).initialize(),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class OrmModule {}
