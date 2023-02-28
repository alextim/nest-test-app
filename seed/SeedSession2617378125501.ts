// https://github.com/adeperio/base/blob/63da021139992bfce1f0ce9d9beacb70529d412a/src/server/bootstrap.js
// https://github.com/sheshbabu/freshlytics/blob/560da73ea66bd7268524317939d79dabf8344edd/src/server/db/migrations/1561030715992_init.sql

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedSession2617378125501 implements MigrationInterface {
  name = 'SeedSession2617378125501';

  public async up(queryRunner: QueryRunner) {
    //** Note this session table script follow the format as defined at https://github.com/voxpelli/node-connect-pg-simple/blob/master/table.sql
    //   The node-connect-pg-simple module uses this to persist sessions to our Postgres Database
    //      Postgres as the session store was used for Base as a
    //      convenient (insofar as not needing developers to go through the setup of another DB)
    //      and fast option for session storage
    //   Other options such as Redis may present faster alternatives...
    await queryRunner.query(`
    CREATE TABLE "session" (
      "sid" varchar NOT NULL COLLATE "default",
	    "sess" json NOT NULL,
	    "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    `);
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.query('DROP TABLE IF EXISTS session');
  }
}
