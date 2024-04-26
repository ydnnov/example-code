import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CaptchaAnswerRequestEntity } from './captcha-answer-request.entity.js';

@Entity({ name: 'captcha_image' })
export class CaptchaImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    url: string;

    @Column()
    base64: string;

    @Column({ nullable: true })
    accepted_answer: string;

    @OneToMany(
        () => CaptchaAnswerRequestEntity,
        (answerRequest) => answerRequest.image,
    )
    answerRequests: CaptchaAnswerRequestEntity[];

}
