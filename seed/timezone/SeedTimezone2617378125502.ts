import path from 'node:path';
import fs from 'node:fs/promises';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTimezone2617378125502 implements MigrationInterface {
  name = 'SeedTimezone2617378125502';

  public async up(queryRunner: QueryRunner) {
    const result = await queryRunner.query('SELECT 1 FROM timezone LIMIT 1');
    if (result.length) {
      return;
    }
    const file = path.resolve(__dirname, 'timezones.csv');

    const data = await fs.readFile(file, { encoding: 'utf8' });

    const arr = data
      .split('\n')
      .filter(Boolean)
      .map((line) =>
        line.split(',').map((field) => {
          let s = field.trim();
          if (s.startsWith('"')) {
            s = s.substring(1);
          }
          if (s.endsWith('"')) {
            s = s.substring(0, s.length - 1);
          }
          return s;
        }),
      );

    await Promise.all(
      arr.map((params) =>
        queryRunner.query(
          'INSERT INTO timezone (code, name) VALUES ($1, $2)',
          params,
        ),
      ),
    );
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.query('DELETE * FROM timezone');
  }
}
