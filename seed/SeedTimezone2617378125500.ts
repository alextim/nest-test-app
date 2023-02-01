import { Timezone } from '../src/modules/schedules/entities/timezone.entity';

import { timezones } from './timezones.data';

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTimezone2617378125500 implements MigrationInterface {
  name = 'SeedTimezone2617378125500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      timezones.map(async (tz) =>
        queryRunner.manager.save(
          queryRunner.manager.create<Timezone>(Timezone, tz),
        ),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM timezone`);
  }
}
