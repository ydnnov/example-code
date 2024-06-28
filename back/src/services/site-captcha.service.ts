import Captcha from '2captcha-ts';
import { db } from '../data-source.js';
import { bus } from '../bus.js';
import { CaptchaAnswerRequestEntity } from '../entities/captcha-answer-request.entity.js';
import { CaptchaImageEntity } from '../entities/captcha-image.entity.js';
import { StdResult } from '../types/common.js';
import { services } from './services.js';
import { AppEvent } from '../shared/classes/app-event.js';
import { parsing } from '../helpers/parsing.js';
import { ParserBase } from '../parsers/parser-base.js';
import { EmitsToBus } from '../classes/emits-to-bus.js';
import { helpers } from '../helpers/helpers.js';

export class SiteCaptchaService extends EmitsToBus {

    protected eventPrefix = 'site-captcha.service';

    public async getAnswer(
        parser: ParserBase,
        key: string,
        imageBase64: string,
        timeout: number,
    ): Promise<StdResult<{ answerText: string }>> {

        const getFromRucaptchaHandler = (eventName: string) => {
            if (eventName !== 'parsing.step') {
                return;
            }
            console.log('getFromRucaptchaHandler');
            bus.emitter.offAny(getFromRucaptchaHandler);
            console.log(`unset handler ${imageBase64.length} bytes`);
            services.siteCaptcha.getFromRucaptchaCom(imageBase64, timeout);
        };

        const answerPromise = new Promise<StdResult<{
            answerText: string
        }>>((resolve, reject) => {
            const handler = (eventName: string, arg) => {
                if (![
                    'captcha.answer-received',
                    'rucaptcha.error',
                ].includes(eventName)) {
                    return;
                }
                bus.emitter.offAny(handler);
                bus.emitter.offAny(getFromRucaptchaHandler);
                console.log('siteCaptcha.getAnswer', { eventName, arg });
                const appEvent = <AppEvent<any>>arg;
                console.log({ appEvent });
                if (eventName === 'captcha.answer-received') {
                    if (!(appEvent.payload || '').length) {
                        resolve({
                            success: false,
                            err: 'empty-captcha-answer',
                        });
                    }
                    console.log(appEvent.payload);
                    resolve({
                        success: true,
                        answerText: appEvent.payload,
                    });
                } else if (eventName === 'rucaptcha.error') {
                    resolve({
                        success: false,
                        err: appEvent.payload,
                    });
                }
                resolve({
                    success: false,
                    err: appEvent.payload,
                });
            };
            bus.onAny(handler);
        });

        if (!parsing.paused) {
            await services.siteCaptcha.getFromRucaptchaCom(imageBase64, timeout);
        } else {
            console.log(`setting handler ${imageBase64.length} bytes`);
            bus.onAny(getFromRucaptchaHandler);
        }

        await answerPromise;
        console.log({ answerPromise });

        return answerPromise;
    }

    public async createAnswerRequest(imageBase64: string)
        : Promise<CaptchaAnswerRequestEntity> {

        let ansreqEnt;

        await db.transaction(async (mgr) => {

            let image;

            const emitResult = await this.emit(
                'create-answer-request.image-find-or-create',
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
                'captcha.create-answer-request.success',
                { mgr, ansreqEnt },
            );
            // delete ansreqEnt.image['base64'];
            // console.log({ ansreqEnt });
        });

        return ansreqEnt;
    }

    public async getFromRucaptchaCom(imageBase64: string, timeout: number) {
        console.log(`getFromRucaptchaCom ${imageBase64.length} bytes`);
        const race = [
            new Promise((resolve) => {
                const solver = new Captcha.Solver('0499f76849203ad92d5c3c642fde9d40');
                solver.imageCaptcha({
                    body: imageBase64,
                    numeric: 0,
                    min_len: 3,
                    max_len: 10,
                }).then((result) => {
                    resolve({
                        success: true,
                        answer: result.data,
                    });
                    bus.emit('captcha.answer-received', result.data);
                }).catch((err) => {
                    resolve({
                        success: false,
                        err,
                    });
                    bus.emit('rucaptcha.error', err);
                });
            }),
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: false,
                        err: 'rucaptcha.timeout',
                    });
                }, timeout);
            }),
        ];
        await bus.emit('rucaptcha.request-answer');
        const result = await Promise.race(race);
        console.log({ result });
        return result;
    }

    public async getAnswerRequest(id: number): Promise<CaptchaAnswerRequestEntity | null> {
        return db.createEntityManager()
            .findOneBy(CaptchaAnswerRequestEntity, { id });
    }

    public async getCaptchaImage(id: number): Promise<CaptchaImageEntity | null> {
        return db.createEntityManager()
            .findOneBy(CaptchaImageEntity, { id });
    }

    public async setUnconfirmedAnswer(answerRequestId: number, answer: string) {

        const mgr = db.createEntityManager();
        const ansrecEnt = await mgr
            .findOneBy<CaptchaAnswerRequestEntity>(
                CaptchaAnswerRequestEntity, { id: answerRequestId },
            );
        if (!ansrecEnt) {
            throw new Error(`Captcha answer request with id=${answerRequestId} not found`);
        }
        ansrecEnt.answer = answer;
        const result = await mgr.save(CaptchaAnswerRequestEntity, ansrecEnt);
    }

    public async confirmAnswer(answerRequestId: number) {

        await db.transaction(async (mgr) => {
            const ansrecEnt = await mgr
                .findOneBy<CaptchaAnswerRequestEntity>(
                    CaptchaAnswerRequestEntity, { id: answerRequestId },
                );
            if (!ansrecEnt) {
                throw new Error(`Captcha answer request with id=${answerRequestId} not found`);
            }
            ansrecEnt.is_answer_accepted = true;
            await mgr.save(CaptchaAnswerRequestEntity, ansrecEnt);

            const imageEnt = await mgr
                .findOneBy<CaptchaImageEntity>(
                    CaptchaImageEntity, { id: ansrecEnt.image_id },
                );
            imageEnt.accepted_answer = ansrecEnt.answer;
            await mgr.save(CaptchaImageEntity, imageEnt);
        });
    }
}
