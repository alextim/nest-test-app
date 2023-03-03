import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTimezone2617378125500 implements MigrationInterface {
  name = 'CreateTimezone2617378125500';

  public async up(queryRunner: QueryRunner) {
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
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.query('DROP TABLE IF EXISTS timezone');
  }
}
