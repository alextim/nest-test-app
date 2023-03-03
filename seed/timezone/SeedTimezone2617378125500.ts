import path from 'node:path';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTimezone2617378125500 implements MigrationInterface {
  name = 'SeedTimezone2617378125500';

  public async up(queryRunner: QueryRunner) {
    const file = path.resolve(process.cwd(), 'timezones.csv');
    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS timezone
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    code character varying(40) COLLATE "default" NOT NULL,
    name character varying(40) COLLATE "default" NOT NULL,
    CONSTRAINT "PK_timezone_id" PRIMARY KEY (id),
    CONSTRAINT "UQ_timezone_code" UNIQUE (code),
    CONSTRAINT "UQ_timezone_name" UNIQUE (name)
)`);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS(SELECT 1 FROM timezone LIMIT 1) 
        THEN
          COPY timezone(code,name) FROM '${file}' DELIMITER ',' CSV;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.query('DELETE * FROM timezone');
  }
}
