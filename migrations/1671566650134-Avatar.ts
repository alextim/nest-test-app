import { MigrationInterface, QueryRunner } from "typeorm";

export class Avatar1671566650134 implements MigrationInterface {
    name = 'Avatar1671566650134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
