import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateParserTables1714229191300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`

            create table if not exists public.parser
            (
                id   serial
                    constraint parser_pk primary key,
                name text default ''::text not null
            );
            create unique index if not exists parser_name_uindex
                on public.parser (name);

            create table if not exists public.parser_task
            (
                id          serial
                    constraint ppt_pk
                        primary key,
                parser_id   integer                                      not null
                    constraint ppt_parser_id_fk
                        references public.parser,
                created_at  timestamp with time zone default now()       not null,
                status      text                     default 'new'::text not null,
                input_data  jsonb                    default '{}'::jsonb not null,
                result_data jsonb
            );

            insert into parser (name)
            values ('msudrf/sudebnoye-deloproizvodstvo'),
                   ('msudrf/territorialnaya-podsudnost')
            on conflict do nothing;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table if exists public.parser_task;
            drop table if exists public.parser;
        `);
    }
}
