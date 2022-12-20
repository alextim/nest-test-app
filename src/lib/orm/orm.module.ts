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
        logger: configService.get('typeorm.logger'), // advanced-console, simple-console, file, debug 
        logging: configService.get('typeorm.logging'), // true, all, query, error, schema, warn, info, log 
        maxQueryExecutionTime: configService.get('typeorm.maxQueryExecutionTime'), // log all queries which run more then `maxQueryExecutionTime`
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class OrmModule {}
