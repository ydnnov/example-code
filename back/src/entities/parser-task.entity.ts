import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { type GenericDictionary } from '../shared/schemas/common.js';

@Entity({ name: 'parser_task' })
export class ParserTaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    parser_index: number;

    @Column({ type: 'timestamptz' })
    created_at: Date;

    @Column({ type: 'text' })
    status: 'new' | 'started' | 'success' | 'failed';

    @Column({ type: 'jsonb' })
    input_data: GenericDictionary;

    @Column({ type: 'jsonb', nullable: true })
    result_data: GenericDictionary;
}
