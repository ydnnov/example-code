import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventBusTables1714104622916 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`

            create table if not exists public.bus_event
            (
                id         serial
                    constraint bus_event_pk
                        primary key,
                event_name text                                   not null,
                side       text                                   not null,
                payload    text,
                created_at timestamp with time zone default now() not null
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table if exists public.bus_event;
        `);
    }
}
