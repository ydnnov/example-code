import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { pwpage, pwpageRecreate } from '../../pwpage.js';
import { FsspGovRuSite } from '../../sites/fssp-gov-ru/fssp-gov-ru.site.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { services } from '../../services/services.js';
import { bus } from '../../bus.js';
import { AppEvent } from '../../shared/classes/app-event.js';
import { FgrCaptchaForm } from '../../sites/fssp-gov-ru/fgr.captcha.form.js';
import { StdResult } from '../../types/common.js';

export class FsspSefizlicoAttemptHandler extends EmitsToBus {

    protected eventPrefix = 'fssp-sefizlico.attempt-handler';

    constructor(
        public readonly attemptEntity: ParserTaskAttemptEntity,
    ) {
        super();
    }

    get inputData() {
        return this.attemptEntity.parserTask.input_data;
    }

    public async perform(numCaptchaAttempts: number = 1): Promise<StdResult> {

        await pwpageRecreate();

        const site = new FsspGovRuSite(pwpage, this.attemptEntity);

        const issIpPageOpenResult = await site.issIpPage.open(15000);
        if (!issIpPageOpenResult.success) {
            return issIpPageOpenResult;
        }

        await site.issIpPage.searchForm.inputFields(
            this.inputData['fio'],
            this.inputData['dob'],
            this.inputData['reg'],
        );

        const searchSubmitResult = await site.issIpPage.searchForm.submitSearch(15000);
        if (!searchSubmitResult.success) {
            return searchSubmitResult;
        }

        const captchaForm = searchSubmitResult.captchaForm;

        const solveCaptchaResult = await this.solveCaptcha(captchaForm, 5);

        console.log({ solveCaptchaResult });
    }

    protected async solveCaptcha(
        captchaForm: FgrCaptchaForm,
        numAttempts: number,
    ): Promise<StdResult> {

        for (let i = 1; i <= numAttempts; i++) {

            const captchaBase64Result = await captchaForm.getImageBase64(5000);
            if (!captchaBase64Result.success) {
                return captchaBase64Result;
            }

            const answer = await this.getCaptchaAnswer(captchaBase64Result.data);
            console.log('received answer: ' + answer);

            await captchaForm.inputAnswer(answer);

            const result = await captchaForm.submit(5000);
            console.log({result});
            if (result.success === true) {
                return result;
            }

            if (result.err === 'has-wrong-captcha-msg') {
                continue;
            }

            // if (result.err === 'smth-wrong-msg' || result.err === 'timeout') {
            return result;
            // }
        }

        return {
            success: false,
            err: 'out-of-attempts',
        };
    }

    protected async getCaptchaAnswer(
        imageBase64: string,
    ): Promise<StdResult> {

        const ansreqEnt = await services.siteCaptcha
            .createAnswerRequest(imageBase64);

        const answerPromise = new Promise<string>((resolve, reject) => {
            const handler = (eventName: string, arg) => {
                if (![
                    'captcha.answer-received',
                    'captcha.rucaptcha-error',
                ].includes(eventName)) {
                    return;
                }
                const appEvent = <AppEvent<any>>arg;
                console.log({ appEvent });
                if (eventName === 'captcha.answer-received') {
                    bus.emitter.offAny(handler);
                    if (!(appEvent.payload || '').length) {
                        resolve({
                            success:false,
                            err:'empty-captcha-answer'
                        })
                    }
                    resolve(appEvent.payload);
                } else if (eventName === 'captcha.rucaptcha-error') {
                    bus.emitter.offAny(handler);
                    resolve({
                        success:false,
                        err:appEvent.payload
                    });
                    resolve({
                        success:true,
                        imageBase64
                    });
                }
            };
            bus.onAny(handler);
        });

        // await services.siteCaptcha.getFromRucaptchaCom(imageBase64);

        return answerPromise;
    }
}
