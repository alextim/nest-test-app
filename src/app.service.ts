import path from 'node:path';
import { Injectable } from '@nestjs/common';
import type { OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.query(`
      DO $$ BEGIN
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
    
    const file = path.resolve(process.cwd(), 'seed', 'timezone', 'timezones.csv');
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS(SELECT 1 FROM timezone LIMIT 1) 
        THEN
          COPY timezone(code,name) FROM '${file}' DELIMITER ',' CSV;
        END IF;
      END $$;
    `);
  }
}
