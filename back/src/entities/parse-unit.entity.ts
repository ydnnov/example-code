import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parser' })
export class ParseUnitEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamptz' })
    name: 'msudrf/sud-delo';

}
