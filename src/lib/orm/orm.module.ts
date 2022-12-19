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
        logger: 'file',
        synchronize: true, // never use TRUE in production!
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class OrmModule {}
