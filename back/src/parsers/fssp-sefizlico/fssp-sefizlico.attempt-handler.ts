import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { pwpage, pwpageRecreate } from '../../pwpage.js';
import { FsspGovRuSite } from '../../sites/fssp-gov-ru/fssp-gov-ru.site.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { services } from '../../services/services.js';
import { bus } from '../../bus.js';
import { AppEvent } from '../../shared/classes/app-event.js';
import { ParsingAttemptError } from '../../errors/parsing/parsing-attempt.error.js';
import { FgrCaptchaForm } from '../../sites/fssp-gov-ru/fgr.captcha.form.js';

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

    public async perform(numCaptchaAttempts: number = 1) {

        await pwpageRecreate();

        const site = new FsspGovRuSite(pwpage, this.attemptEntity);

        // return;
        if (!await site.issIpPage.open(15000)) {
            return false;
        }
        await site.issIpPage.searchForm.inputFields(
            this.inputData['fio'],
            this.inputData['dob'],
            this.inputData['reg'],
        );
        const captchaForm = await site.issIpPage.searchForm.submitSearch(15000);
        console.log({ captchaForm });
        // const captchaForm = await site.issIpPage.searchForm.submitSearch(15000);
        // // console.log({ captchaForm });
        // if (!captchaForm) {
        //     this.emit('no-captcha-form');
        //     const smthWrongMsg = await site.hasSomethingWentWrongMessage(5000);
        //     console.log({ smthWrongMsg });
        //     return false;
        // }
        // const solveCaptchaResult = await this.solveCaptcha(captchaForm, 5);

        // console.log({ solveCaptchaResult });
    }

    protected async solveCaptcha(captchaForm: FgrCaptchaForm, numAttempts: number) {
        // console.log({ captchaForm, numAttempts });
        for (let i = 1; i <= numAttempts; i++) {
            const captchaBase64 = await captchaForm.getImageBase64(5000);
            const answer = await this.getCaptchaAnswer(captchaBase64);
            console.log('received answer: ' + answer);
            await captchaForm.inputAnswer(answer);
            const result = await captchaForm.submit(5000);
            console.log({ result });
            // const smthWrongMsg = await captchaForm.site.hasSomethingWentWrongMessage(5000);
            // console.log({ smthWrongMsg });
            // if (result === 'timeout') {
            //     continue;
            // }
            // if (result === 'wrong-answer') {
            //     continue;
            // }
            // if (result === 'success') {
            //     return true;
            // }
        }
        return false;
    }

    protected async getCaptchaAnswer(
        imageBase64: string,
    ): Promise<string> {

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
                        reject('Empty captcha answer');
                    }
                    resolve(appEvent.payload);
                } else if (eventName === 'captcha.rucaptcha-error') {
                    bus.emitter.offAny(handler);
                    reject(appEvent.payload);
                }
            };
            bus.onAny(handler);
        });

        // await services.siteCaptcha.getFromRucaptchaCom(imageBase64);

        return answerPromise;
    }
}
