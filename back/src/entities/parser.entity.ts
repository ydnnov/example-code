import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Page as PlaywrightPage } from 'playwright';
import { parsers } from '../parsers/parsers.js';
import { ParseUnitEntity } from './parse-unit.entity.js';

@Entity({ name: 'parser' })
export class ParserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: 'msudrf/sud-delo';

    public async run(unit: ParseUnitEntity) {
        switch (this.name) {
            case 'msudrf/sud-delo':
                return parsers.msudrfSudDelo.run();
            default:
                throw new Error(`Unknown parser ${this.name}`);
        }
    }
}
