import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Static, Type } from '@sinclair/typebox';

export const parserTaskAttemptRunOptionsSchema = Type.Object({
    timeout: Type.Number(),
});

export type ParserTaskAttemptRunOptionsType = Static<typeof parserTaskAttemptRunOptionsSchema>

@Entity({ name: 'parser_task_attempt' })
export class ParserTaskAttemptEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    parser_task_id: number;

    @Column({ type: 'timestamptz' })
    started_at: Date;

    @Column({ type: 'timestamptz', nullable: true })
    ended_at: Date;

    @Column({ type: 'text' })
    status: 'new' | 'success' | 'failed';

    @Column({ type: 'text', nullable: true })
    failure_reason: string;

    @Column({ type: 'jsonb' })
    run_options: ParserTaskAttemptRunOptionsType;

    @BeforeInsert()
    validate(...args) {
        console.log('validate');
        console.log(this.constructor.name);
        console.log({ args });
    }
}
