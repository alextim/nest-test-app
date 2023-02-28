import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getDataSourceOptions } from './datasource.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
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
        password: 'admin',
      }),
      // dataSource receives the configured DataSourceOptions
      // and returns a Promise<DataSource>.
      //dataSourceFactory: async (options) => new DataSource(options).initialize(),
    }),
  ],
  // exports: [TypeOrmModule],
})
export class OrmModule {}
