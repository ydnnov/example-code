import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateParserTables1714229191300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`

            create table if not exists public.parser_task
            (
                id           serial
                    constraint ppt_pk
                        primary key,
                parser_index integer                                      not null,
                created_at   timestamp with time zone default now()       not null,
                status       text                     default 'new'::text not null,
                input_data   jsonb                    default '{}'::jsonb not null,
                result_data  jsonb
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table if exists public.parser_task;
        `);
    }
}
