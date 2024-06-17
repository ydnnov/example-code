import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ParserNameType } from '../shared/schemas/parsing.js';

@Entity({ name: 'parser' })
export class ParserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: () => ParserNameType;
}
