import { MigrationInterface, QueryRunner } from "typeorm";

export class Scraper1673418951204 implements MigrationInterface {
    name = 'Scraper1673418951204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "linked_in_profile" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "auth_cookie" character varying(152) NOT NULL, CONSTRAINT "PK_linked_in_profile_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parser" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "parser_type" character varying NOT NULL DEFAULT 'replace', "regex" character varying, "match_group" character varying, "multiply" boolean DEFAULT false, "separator" boolean DEFAULT false, "is_regex" boolean DEFAULT false, "pattern" character varying(64), "replacement" character varying(64), "append" character varying(64), "prepend" character varying(64), "strip_html_tags" boolean DEFAULT true, "decode_html_entities" boolean DEFAULT false, "remove_whitespaces" boolean DEFAULT true, "remove_newlines" boolean DEFAULT false, "selector_id" integer, CONSTRAINT "PK_parser_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."selector_type_enum" AS ENUM('text', 'link', 'popupLink', 'image', 'table', 'attribute', 'html', 'scrollDown', 'click', 'grouped', 'sitemap', 'pagination')`);
        await queryRunner.query(`CREATE TABLE "selector" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(20) NOT NULL, "selector" character varying(64) NOT NULL, "type" "public"."selector_type_enum" NOT NULL DEFAULT 'text', "multiply" boolean DEFAULT false, "regex" character varying(64), "query_id" integer, CONSTRAINT "UQ_selector_name" UNIQUE ("name"), CONSTRAINT "PK_selector_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "query" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "start_url" character varying NOT NULL, "request_interval" integer NOT NULL, "page_load_delay" integer NOT NULL, "timeout" integer NOT NULL, "wait_until" character varying NOT NULL DEFAULT 'load', "proxy_id" integer, CONSTRAINT "UQ_query_name" UNIQUE ("name"), CONSTRAINT "PK_query_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "proxy" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "token" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "region" character varying NOT NULL, "parallel_scraping_job_limit" integer NOT NULL, "host" character varying NOT NULL, "port" integer NOT NULL, CONSTRAINT "PK_proxy_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "request_interval" integer NOT NULL, "page_load_delay" integer NOT NULL, "timeout" integer NOT NULL, "cron_enabled" boolean NOT NULL, "timezone" character varying(40), "scheduler_type" character varying, "daily_weekdays" boolean array, "daily_time" TIME, "interval" character varying(4), "interval_type" character varying, "proxy_id" integer, "query_id" integer, "customer_id" integer, "user_id" integer, CONSTRAINT "UQ_site_name" UNIQUE ("name"), CONSTRAINT "PK_schedule_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "request_interval" integer NOT NULL, "page_load_delay" integer NOT NULL, "timeout" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'waiting', "user_id" integer, "proxy_id" integer, "query_id" integer, "customer_id" integer, CONSTRAINT "PK_job_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" integer GENERATED ALWAYS AS IDENTITY NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "first_name" character varying(40), "last_name" character varying(40), CONSTRAINT "PK_customer_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parser" ADD CONSTRAINT "FK_parser_selector_id__selector_id" FOREIGN KEY ("selector_id") REFERENCES "selector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "selector" ADD CONSTRAINT "FK_selector_query_id__query_id" FOREIGN KEY ("query_id") REFERENCES "query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "query" ADD CONSTRAINT "FK_query_proxy_id__proxy_id" FOREIGN KEY ("proxy_id") REFERENCES "proxy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_schedule_proxy_id__proxy_id" FOREIGN KEY ("proxy_id") REFERENCES "proxy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_schedule_query_id__query_id" FOREIGN KEY ("query_id") REFERENCES "query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_schedule_customer_id__customer_id" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_schedule_user_id__user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_job_user_id__user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_job_proxy_id__proxy_id" FOREIGN KEY ("proxy_id") REFERENCES "proxy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_job_query_id__query_id" FOREIGN KEY ("query_id") REFERENCES "query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_job_customer_id__customer_id" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_job_customer_id__customer_id"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_job_query_id__query_id"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_job_proxy_id__proxy_id"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_job_user_id__user_id"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_schedule_user_id__user_id"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_schedule_customer_id__customer_id"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_schedule_query_id__query_id"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_schedule_proxy_id__proxy_id"`);
        await queryRunner.query(`ALTER TABLE "query" DROP CONSTRAINT "FK_query_proxy_id__proxy_id"`);
        await queryRunner.query(`ALTER TABLE "selector" DROP CONSTRAINT "FK_selector_query_id__query_id"`);
        await queryRunner.query(`ALTER TABLE "parser" DROP CONSTRAINT "FK_parser_selector_id__selector_id"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "job"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`DROP TABLE "proxy"`);
        await queryRunner.query(`DROP TABLE "query"`);
        await queryRunner.query(`DROP TABLE "selector"`);
        await queryRunner.query(`DROP TYPE "public"."selector_type_enum"`);
        await queryRunner.query(`DROP TABLE "parser"`);
        await queryRunner.query(`DROP TABLE "linked_in_profile"`);
    }

}
