import { MigrationInterface, QueryRunner } from 'typeorm';

import { Timezone } from '../src/modules/timezones/entities/timezone.entity';
import { timezones } from './timezones.data';

export class SeedTimezone2617378125500 implements MigrationInterface {
  name = 'SeedTimezone2617378125500';

  public async up(queryRunner: QueryRunner) {
    await Promise.all(
      timezones.map(async (tz) =>
        queryRunner.manager.save(
          queryRunner.manager.create<Timezone>(Timezone, tz),
        ),
      ),
    );
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.query('DELETE * FROM timezone');
  }
}
