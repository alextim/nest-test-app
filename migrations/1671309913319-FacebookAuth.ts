import { MigrationInterface, QueryRunner } from "typeorm";

export class FacebookAuth1671309913319 implements MigrationInterface {
    name = 'FacebookAuth1671309913319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "is_registered_with_facebook" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "facebook_id" character varying(21)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "facebook_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_registered_with_facebook"`);
    }

}
