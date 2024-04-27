import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateParserTables1714229191300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // TODO сидер как то покрасивее сделать, разобраться как в typeorm
        await queryRunner.query(`

            create table public.parser
            (
                id   serial constraint parser_pk primary key,
                name text default ''::text not null
            );

            create table public.parse_unit
            (
                id         serial constraint parse_unit_pk primary key,
                parser_id  integer                                      not null
                    constraint parse_unit_parser_id_fk references public.parser,
                created_at timestamp with time zone default now()       not null,
                status     text                     default 'new'::text not null,
                input_data jsonb                    default '{}'::jsonb not null
            );

            insert into parser (name)
            values ('msudrf/sud-delo');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table parse_unit;
            drop table parser;
        `);
    }

}
