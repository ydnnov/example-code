import Captcha from '2captcha-ts';
import { db } from '../data-source.js';
import { bus } from '../bus.js';
import { CaptchaAnswerRequestEntity } from '../entities/captcha-answer-request.entity.js';
import { CaptchaImageEntity } from '../entities/captcha-image.entity.js';
import { SiteCaptchaSetAnswerType } from '../schemas/site-captcha.schema.js';

export class SiteCaptchaService {

    public async createAnswerRequest(imageBase64: string): Promise<CaptchaAnswerRequestEntity> {

        let ansreqEnt;

        await db.transaction(async (mgr) => {

            let image;

            const emitResult = await bus.emit(
                'bk.captcha.create-answer-request.image-find-or-create',
                { mgr, imageBase64 },
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

            ansreqEnt = new CaptchaAnswerRequestEntity();
            ansreqEnt.image_id = image.id;
            const { id } = await mgr.save(CaptchaAnswerRequestEntity, ansreqEnt);
            ansreqEnt = await mgr.findOneBy(CaptchaAnswerRequestEntity, { id });
            await bus.emit(
                'captcha:create-answer-request:success',
                { mgr, ansreqEnt },
            );
            // delete ansreqEnt.image['base64'];
            // console.log({ ansreqEnt });
        });

        return ansreqEnt;
    }

    public async getFromRucaptchaCom(imageBase64: string) {
        await bus.emit('captcha.requesting-answer');
        try {
            const solver = new Captcha.Solver('0499f76849203ad92d5c3c642fde9d40');
            const result = await solver.imageCaptcha({
                body: imageBase64,
                numeric: 0,
                min_len: 3,
                max_len: 10,
            });
            await bus.emit('captcha.answer-received', result.data);
        } catch (err) {
            await bus.emit('captcha.rucaptcha-error', err);
        }
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

        // const mgr = db.createEntityManager();
        // const ansrecEnt = await mgr
        //     .findOneBy(CaptchaAnswerRequestEntity, { id: answerRequestId });
        // delete ansrecEnt.image['base64'];
        // console.log({ ansrecEnt });
        // ansrecEnt.answer = answer;
        // const result = await mgr.save(CaptchaAnswerRequestEntity, ansrecEnt);
        // console.log({ result });
        // // bus

    }
}
