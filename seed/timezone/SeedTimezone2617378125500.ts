import path from 'node:path';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTimezone2617378125500 implements MigrationInterface {
  name = 'SeedTimezone2617378125500';

  public async up(queryRunner: QueryRunner) {
    const file = path.resolve(process.cwd(), 'timezones.csv');
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
