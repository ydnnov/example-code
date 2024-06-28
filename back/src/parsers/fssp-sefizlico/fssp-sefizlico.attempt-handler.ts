import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { pwpage, pwpageRecreate } from '../../pwpage.js';
import { FsspGovRuSite } from '../../sites/fssp-gov-ru/fssp-gov-ru.site.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { services } from '../../services/services.js';
import { bus } from '../../bus.js';
import { FgrCaptchaForm } from '../../sites/fssp-gov-ru/fgr.captcha.form.js';
import { StdResult } from '../../types/common.js';
import { parsing } from '../../helpers/parsing.js';
import { FsspSefizlicoParser } from './fssp-sefizlico.parser.js';
import { Page as PlaywrightPage } from 'playwright';

export class FsspSefizlicoAttemptHandler extends EmitsToBus {

    protected eventPrefix = 'fssp-sefizlico.attempt-handler';

    constructor(
        public readonly parser: FsspSefizlicoParser,
        public readonly attemptEntity: ParserTaskAttemptEntity,
        public readonly pwpage: PlaywrightPage,
    ) {
        super();
    }

    get inputData() {
        return this.attemptEntity.parserTask['input_data'];
    }

    public async perform(): Promise<StdResult> {

        await pwpageRecreate();

        const site = new FsspGovRuSite(pwpage, this.attemptEntity);

        await parsing.step('open-page');

        const issIpPageOpenResult = await site.issIpPage.open(60000);
        if (!issIpPageOpenResult.success) {
            return issIpPageOpenResult;
        }

        await parsing.step('input-fields');

        await site.issIpPage.searchForm.inputFields(
            this.inputData['fio'],
            this.inputData['dob'],
            this.inputData['reg'],
        );

        await parsing.step('submit-form');

        const searchSubmitResult = await site.issIpPage.searchForm.submitSearch(60000);
        if (!searchSubmitResult.success) {
            return searchSubmitResult;
        }

        await parsing.step('solve-captcha');

        const solveCaptchaResult = await this.solveCaptcha(searchSubmitResult.captchaForm);

        if (!solveCaptchaResult.success) {
            return solveCaptchaResult;
        }

        await parsing.step('before-...');

        console.log({ solveCaptchaResult });
    }

    protected async solveCaptcha(captchaForm: FgrCaptchaForm): Promise<StdResult> {

        let i = 0;
        let stop = false;
        bus.on('parsing.break', () => {
            stop = true;
        });
        while(!stop) {

            i++;

            await parsing.step(`solve-captcha-attempt-${i}`);

            const captchaBase64Result = await captchaForm.getImageBase64(60000);
            if (!captchaBase64Result.success) {
                return captchaBase64Result;
            }

            const answer = await services.siteCaptcha.getAnswer(
                this.parser,
                'start',
                captchaBase64Result.data,
            );
            // const answer = await this.getCaptchaAnswer(captchaBase64Result.data);
            console.log('received captcha answer', answer);

            if (!answer.success) {
                continue;
            }

            await captchaForm.inputAnswer(answer.answerText);

            const result = await captchaForm.submit(60000);
            console.log({ result });
            if (result.success === true) {
                return result;
            }

            // if (result.err === 'has-wrong-captcha-msg') {
            //     continue;
            // }
            //
            // // if (result.err === 'smth-wrong-msg' || result.err === 'timeout') {
            // return result;
            // // }
        }

        return {
            success: false,
            err: 'out-of-attempts',
        };
    }

    // protected async getCaptchaAnswer(
    //     imageBase64: string,
    // ): Promise<StdResult<{ answerText: string }>> {
    //
    //     const ansreqEnt = await services.siteCaptcha
    //         .createAnswerRequest(imageBase64);
    //
    //     const answerPromise = new Promise<StdResult<{ answerText: string }>>((resolve, reject) => {
    //         const handler = (eventName: string, arg) => {
    //             console.log({ eventName, arg });
    //             if (![
    //                 'captcha.answer-received',
    //                 'captcha.rucaptcha-error',
    //             ].includes(eventName)) {
    //                 return;
    //             }
    //             bus.emitter.offAny(handler);
    //             const appEvent = <AppEvent<any>>arg;
    //             console.log({ appEvent });
    //             if (eventName === 'captcha.answer-received') {
    //                 if (!(appEvent.payload || '').length) {
    //                     resolve({
    //                         success: false,
    //                         err: 'empty-captcha-answer',
    //                     });
    //                 }
    //                 resolve({
    //                     success: true,
    //                     answerText: appEvent.payload,
    //                 });
    //             } else if (eventName === 'captcha.rucaptcha-error') {
    //                 resolve({
    //                     success: false,
    //                     err: appEvent.payload,
    //                 });
    //             }
    //             resolve({
    //                 success: false,
    //                 err: appEvent.payload,
    //             });
    //         };
    //         bus.onAny(handler);
    //     });
    //
    //     if (!parsing.paused) {
    //         // await services.siteCaptcha.getFromRucaptchaCom(imageBase64);
    //     }
    //
    //     return answerPromise;
    // }
}
