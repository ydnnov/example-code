import { db } from '../data-source.js';
import { CaptchaAnswerRequestEntity } from '../entities/captcha-answer-request.entity.js';
import { CaptchaImageEntity } from '../entities/captcha-image.entity.js';
import EventEmitter2 from 'eventemitter2';

export class SiteCaptchaService {

    public events = new EventEmitter2();

    public async createAnswerRequest(imageBase64: string): Promise<CaptchaAnswerRequestEntity> {

        let answerRequest;

        await db.transaction(async (manager) => {

            let image;

            const emitResult = await this.events.emitAsync(
                'createAnswerRequest::imageFindOrCreate',
                manager,
                imageBase64,
            );

            if (emitResult.length && emitResult[0]) {
                image = emitResult[0];
            } else {
                image = await manager.findOneBy(CaptchaImageEntity, {
                    base64: imageBase64,
                });
                if (!image) {
                    image = new CaptchaImageEntity();
                    image.base64 = imageBase64;
                    const result = await manager.insert(CaptchaImageEntity, image);
                    const id = result.identifiers[0].id;
                    image = await manager.findOneBy(CaptchaImageEntity, { id });
                }
            }

            answerRequest = new CaptchaAnswerRequestEntity();
            answerRequest.image_id = image.id;
            const result = await manager.insert(CaptchaAnswerRequestEntity, answerRequest);
            const id = result.identifiers[0].id;
            answerRequest = await manager.findOneBy(CaptchaAnswerRequestEntity, { id });

            await this.events.emitAsync(
                'createAnswerRequest::success',
                manager,
                answerRequest
            );
        });

        return answerRequest;
    }

    public async getAnswerRequest(id: number): Promise<CaptchaAnswerRequestEntity | null> {
        return db.createEntityManager()
            .findOneBy(CaptchaAnswerRequestEntity, { id });
    }

    public async getCaptchaImage(id: number): Promise<CaptchaImageEntity | null> {
        return db.createEntityManager()
            .findOneBy(CaptchaImageEntity, { id });
    }
}
