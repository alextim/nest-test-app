import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1671303743754 implements MigrationInterface {
    name = '$npmConfigName1671303743754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "google_id" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "google_id"`);
    }

}
