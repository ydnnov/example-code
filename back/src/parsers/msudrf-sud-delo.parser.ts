import { services } from '../services/services.js';
import { helpers } from '../helpers/helpers.js';
import { CaptchaImageEntity } from '../entities/captcha-image.entity.js';
import { CaptchaAnswerRequestEntity } from '../entities/captcha-answer-request.entity.js';
import { EntityManager } from 'typeorm';
import { websocket } from '../websocket.js';

export class MsudrfSudDeloParser {

    public async openStartPage() {
        const page = await services.headless.getPage();
        const url = 'http://32.sar.msudrf.ru/modules.php?name=sud_delo&op=hl';
        await page.goto(url);
    }

    public async solveCaptcha() {

        // Usage:
        //
        // services.siteCaptcha.events.on(
        //     'createAnswerRequest::imageFindOrCreate',
        //     (manager, imageBase64) => {
        //         return manager.findOneBy(CaptchaImageEntity, {
        //             id: 2,
        //         });
        //     });

        services.siteCaptcha.events.on(
            'createAnswerRequest::success',
            (manager: EntityManager, answerRequest: CaptchaAnswerRequestEntity) => {
                // console.log(answerRequest);
                const result = websocket.emit(
                    'createAnswerRequest::success',
                    answerRequest,
                );
                console.log({ result });
            });

        const page = await services.headless.getPage();
        const imageElem = await page.$('img[src="/captcha.php"]');
        const imageBase64 = await helpers.getImageBase64(
            page,
            imageElem,
        );
        const answerRequest = await services.siteCaptcha
            .createAnswerRequest(imageBase64);

        // console.log(answerRequest);
    }

}
