import { MigrationInterface, QueryRunner } from "typeorm";

export class GoogleId211671304391316 implements MigrationInterface {
    name = 'GoogleId211671304391316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "google_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "google_id" character varying(21)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "google_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "google_id" character varying(20)`);
    }

}
