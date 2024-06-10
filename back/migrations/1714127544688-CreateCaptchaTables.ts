import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCaptchaTables1714127544688 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`

            create table if not exists public.captcha_image
            (
                id              serial
                    constraint pci_pk
                        primary key,
                url             text,
                base64          text not null,
                accepted_answer text
            );

            create table if not exists public.captcha_answer_request
            (
                id                 serial
                    constraint pcar_pk
                        primary key,
                requested_at       timestamp with time zone default now() not null,
                image_id           integer                                not null
                    constraint pcar_captcha_image_id_fk references public.captcha_image,
                answer             text,
                is_answer_accepted boolean
            );
            create index if not exists pcar_image_id_index on public.captcha_answer_request (image_id);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            drop table if exists public.captcha_answer_request;
            drop table if exists public.captcha_image;
        `);
    }
}
