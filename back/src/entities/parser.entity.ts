import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'parser' })
export class ParserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: 'msudrf/sud-delo';

}
