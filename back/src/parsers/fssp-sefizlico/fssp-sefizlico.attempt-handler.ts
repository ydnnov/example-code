import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { pwpage, pwpageRecreate } from '../../pwpage.js';
import { FsspGovRuSite } from '../../sites/fssp-gov-ru/fssp-gov-ru.site.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { services } from '../../services/services.js';
import { bus } from '../../bus.js';
import { AppEvent } from '../../shared/classes/app-event.js';

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

    public async perform() {

        await pwpageRecreate();

        const site = new FsspGovRuSite(pwpage, this.attemptEntity);

        // return;
        await site.issIpPage.open(5000);
        await site.issIpPage.searchForm.inputFields(
            this.inputData['fio'],
            this.inputData['dob'],
            this.inputData['reg'],
        );
        const captchaForm = await site.issIpPage.searchForm.submitSearch(10000);
        const captchaBase64 = await captchaForm.getImageBase64(5000);
        console.log({ captchaForm });
        const answer = await this.getCaptchaAnswer(captchaBase64);
        console.log('received answer');
        console.log({ answer });
        captchaForm.inputAnswer(answer);
    }

    protected async getCaptchaAnswer(
        imageBase64: string,
    ): Promise<string> {

        const ansreqEnt = await services.siteCaptcha
            .createAnswerRequest(imageBase64);

        const answerPromise = new Promise<string>((resolve, reject) => {
            bus.once('captcha.answer-received', (appEvent: AppEvent<any>) => {
                if (!(appEvent.payload || '').length) {
                    reject('Empty captcha answer');
                }
                resolve(appEvent.payload);
            });
            bus.once('captcha.rucaptcha-error', (appEvent: AppEvent<any>) => {
                reject(appEvent.payload);
            });
        });

        // await services.siteCaptcha.getFromRucaptchaCom(imageBase64);

        return answerPromise;
    }
}
