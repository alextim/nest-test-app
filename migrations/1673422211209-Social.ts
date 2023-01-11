import { MigrationInterface, QueryRunner } from "typeorm";

export class Social1673422211209 implements MigrationInterface {
    name = 'Social1673422211209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "linked_in_profile" ADD "customer_id" integer`);
        await queryRunner.query(`ALTER TABLE "linked_in_profile" ADD CONSTRAINT "UQ_05861f53d42bdd86d09e8755c37" UNIQUE ("customer_id")`);
        await queryRunner.query(`ALTER TABLE "linked_in_profile" ADD CONSTRAINT "FK_linked_in_profile_customer_id__customer_id" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "linked_in_profile" DROP CONSTRAINT "FK_linked_in_profile_customer_id__customer_id"`);
        await queryRunner.query(`ALTER TABLE "linked_in_profile" DROP CONSTRAINT "UQ_05861f53d42bdd86d09e8755c37"`);
        await queryRunner.query(`ALTER TABLE "linked_in_profile" DROP COLUMN "customer_id"`);
    }

}
