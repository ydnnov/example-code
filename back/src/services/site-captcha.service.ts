import { db } from '../data-source.js';
import { CaptchaAnswerRequestEntity } from '../entities/captcha-answer-request.entity.js';
import { CaptchaImageEntity } from '../entities/captcha-image.entity.js';
import EventEmitter2 from 'eventemitter2';
import { SiteCaptchaAcceptAnswerType, SiteCaptchaSetAnswerType } from '../schemas/site-captcha.schema.js';

export class SiteCaptchaService {

    public events = new EventEmitter2();

    public async createAnswerRequest(imageBase64: string): Promise<CaptchaAnswerRequestEntity> {

        let ansrecEnt;

        await db.transaction(async (mgr) => {

            let image;

            const emitResult = await this.events.emitAsync(
                'createAnswerRequest::imageFindOrCreate',
                mgr,
                imageBase64,
            );

            if (emitResult.length && emitResult[0]) {
                image = emitResult[0];
            } else {
                image = await mgr.findOneBy(CaptchaImageEntity, {
                    base64: imageBase64,
                });
                if (!image) {
                    image = new CaptchaImageEntity();
                    image.base64 = imageBase64;
                    const { id } = await mgr.save(CaptchaImageEntity, image);
                    image = await mgr.findOneBy(CaptchaImageEntity, { id });
                    // delete image.base64;
                    // console.log({ image });
                }
            }

            ansrecEnt = new CaptchaAnswerRequestEntity();
            ansrecEnt.image_id = image.id;
            const { id } = await mgr.save(CaptchaAnswerRequestEntity, ansrecEnt);
            ansrecEnt = await mgr.findOneBy(CaptchaAnswerRequestEntity, { id });
            await this.events.emitAsync(
                'createAnswerRequest::success',
                mgr,
                ansrecEnt,
            );
            // delete ansrecEnt.image['base64'];
            // console.log({ ansrecEnt });
        });

        return ansrecEnt;
    }

    public async getAnswerRequest(id: number): Promise<CaptchaAnswerRequestEntity | null> {
        return db.createEntityManager()
            .findOneBy(CaptchaAnswerRequestEntity, { id });
    }

    public async getCaptchaImage(id: number): Promise<CaptchaImageEntity | null> {
        return db.createEntityManager()
            .findOneBy(CaptchaImageEntity, { id });
    }

    public async setAnswer({ answerRequestId, answer }: SiteCaptchaSetAnswerType) {

        const mgr = db.createEntityManager();
        const ansrecEnt = await mgr
            .findOneBy(CaptchaAnswerRequestEntity, { id: answerRequestId });
        delete ansrecEnt.image['base64'];
        console.log({ ansrecEnt });
        ansrecEnt.answer = answer;
        const result = await mgr.save(CaptchaAnswerRequestEntity, ansrecEnt);
        console.log({ result });
        // this.events

    }
}
