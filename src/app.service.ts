import { Injectable } from '@nestjs/common';
import type { OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { timezones } from '../seed/timezone/timezones.data';
import { Timezone } from './modules/timezones/entities/timezone.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly configService: ConfigService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.query(`
    DO $$
      BEGIN
        IF NOT EXISTS(SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'session') 
        THEN
          CREATE TABLE session (
            sid varchar NOT NULL COLLATE "default",
            sess json NOT NULL,
            expire timestamp(6) NOT NULL
          )
          WITH (OIDS=FALSE);
          ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY(sid) NOT DEFERRABLE INITIALLY IMMEDIATE;
        END IF;
      END $$;
    `);

    const [{ count }] = await queryRunner.query(
      `SELECT COUNT(*) from timezone`,
    );
    if (+count === 0) {
      await Promise.all(
        timezones.map(async (tz) =>
          queryRunner.manager.save(
            queryRunner.manager.create<Timezone>(Timezone, tz),
          ),
        ),
      );
    }
  }
}
