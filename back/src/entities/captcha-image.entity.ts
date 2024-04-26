import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

}
