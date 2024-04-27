import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parse_unit' })
export class ParseUnitEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    parser_id: number;

    @Column({ type: 'timestamptz' })
    created_at: Date;

    @Column({ type: 'text' })
    status: 'new' | 'started' | 'success' | 'failed';

    @Column({ type: 'jsonb' })
    input_data: { [k: string]: any };

    @Column({ type: 'jsonb', nullable: true })
    result_data: { [k: string]: any };

}
