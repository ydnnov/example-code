import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CaptchaImageEntity } from './captcha-image.entity.js';

@Entity({ name: 'captcha_answer_request' })
export class CaptchaAnswerRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamptz' })
    requested_at: Date;

    @Column()
    image_id: number;

    @ManyToOne(
        () => CaptchaImageEntity,
        (image) => image.answerRequests, {
            eager: true,
        },
    )
    @JoinColumn({ name: 'image_id' })
    image: () => CaptchaImageEntity;

    @Column({ nullable: true })
    answer: string;

    @Column({ nullable: true })
    is_answer_accepted: boolean;

}
