import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bus_event' })
export class BusEventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    event_name: string;

    @Column({ type: 'text' })
    side: string;

    @Column({ type: 'text' })
    payload: string;

    @Column({ type: 'timestamptz' })
    created_at: Date;
}
