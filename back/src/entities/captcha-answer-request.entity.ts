import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'captcha_answer_request' })
export class CaptchaAnswerRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamptz' })
    requested_at: Date;

    @Column()
    image_id: number;

    @Column({ nullable: true })
    answer: string;

    @Column({ nullable: true })
    is_answer_accepted: boolean;

}
