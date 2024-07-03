import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { pwpage, pwpageRecreate } from '../../pwpage.js';
import { FsspGovRuSite } from '../../sites/fssp-gov-ru/fssp-gov-ru.site.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { services } from '../../services/services.js';
import { bus } from '../../bus.js';
import { FgrCaptchaForm } from '../../sites/fssp-gov-ru/fgr.captcha.form.js';
import { RaceResult, RaceResultSuccess, StdResult } from '../../types/common.js';
import { parsing } from '../../helpers/parsing.js';
import { FsspSefizlicoParser } from './fssp-sefizlico.parser.js';
import { Page as PlaywrightPage } from 'playwright';
import { helpers } from '../../helpers/helpers.js';
import { bag } from '../../bag.js';
import { FsspSefizlicoCaptchaSolver } from './fssp-sefizlico.captcha-solver.js';
import { FgrIssIpPage } from '../../sites/fssp-gov-ru/fgr.iss-ip.page.js';

const RESET_RESULT: StdResult = {
    success: false,
    err: 'parser-reset',
};

export class FsspSefizlicoAttemptHandler extends EmitsToBus {

    protected eventPrefix = 'fssp-sefizlico.attempt-handler';

    protected site: FsspGovRuSite;

    protected fgrCaptchaForm: FgrCaptchaForm;

    protected issIpPageOpenResult: RaceResultSuccess<{ page: FgrIssIpPage }>;
    protected searchSubmitResult: RaceResultSuccess<{ captchaForm: FgrCaptchaForm }>;

    constructor(
        public readonly parser: FsspSefizlicoParser,
        public readonly attemptEntity: ParserTaskAttemptEntity,
        public readonly pwpage: PlaywrightPage,
    ) {
        super();
        this.site = new FsspGovRuSite(pwpage, this.attemptEntity);
    }

    get inputData() {
        return this.attemptEntity.parserTask['input_data'];
    }

    get issIpPage() {
        return this.site.issIpPage;
    }

    get issIpSearchForm() {
        return this.issIpPage.searchForm;
    }

    public async perform(): Promise<StdResult> {

        // parsing.playUntilStep('...');

        // await pwpageRecreate();
        console.log('perform');
        const steps = [
            'open-page',
            'input-fields',
            'submit-form',
            'solve-captcha',
            '...',
        ];

        for (let i = 0; i < steps.length; i++) {
            console.log();
            const stepResult = await parsing.step(steps[i]);
            console.log({ stepResult });
            if (stepResult) {
                return RESET_RESULT;
            }
            if (this[steps[i]]) {
                const stepResult = await this[steps[i]]();
                console.log('stepResult', stepResult);
                if (!stepResult.success) {
                    return stepResult;
                }
            }
        }

        // if (await parsing.step('open-page')) {
        //     return RESET_RESULT;
        // }
        //
        // const issIpPageOpenResult = await this.site.issIpPage.open(60000);
        // if (!issIpPageOpenResult.success) {
        //     return issIpPageOpenResult;
        // }
        //
        // if (await parsing.step('input-fields')) {
        //     return RESET_RESULT;
        // }
        // await this.site.issIpPage.searchForm.inputFields(
        //     this.inputData['fio'],
        //     this.inputData['dob'],
        //     this.inputData['reg'],
        // );
        //
        // if (await parsing.step('submit-form')) {
        //     return RESET_RESULT;
        // }
        // const searchSubmitResult = await this.site.issIpPage.searchForm.submitSearch(60000);
        // if (!searchSubmitResult.success) {
        //     return searchSubmitResult;
        // }
        //
        // if (await parsing.step('solve-captcha')) {
        //     return RESET_RESULT;
        // }
        //
        // bag['captchaForm'] = searchSubmitResult.captchaForm;
        // const captchaSolver = new FsspSefizlicoCaptchaSolver(this);
        // bag['captchaSolver'] = captchaSolver;
        // const solveCaptchaResult = await captchaSolver
        //     .trySolve(searchSubmitResult.captchaForm);
        //
        // if (await parsing.step('...')) {
        //     return RESET_RESULT;
        // }


        // const solveCaptchaResult = await this.solveCaptcha(searchSubmitResult.captchaForm);
        //
        // if (!solveCaptchaResult.success) {
        //     console.log({ solveCaptchaResult });
        //     return solveCaptchaResult;
        // }
        //
        // const rp = await searchSubmitResult.captchaForm.resultsPage;
        //
        // // const rp = new FgrIisfResultsPage(new FsspGovRuSite(page));
        // const pagination = await rp.getPagination();
        // const numFound = await rp.getNumFound();
        // console.log({ pagination, numFound });
        // await rp.openNextPage();
        // // bag['rp'] = rp;
        //
        //
        // if (await parsing.step('before-...')) {
        //     return RESET_RESULT;
        // }
        // console.log({ solveCaptchaResult });
    }

    protected async 'open-page'() {
        console.log('>>>>>>>>>>>>>> open-page');
        const result = await this.site.issIpPage.open(60000);
        return result;
    }

    protected async 'input-fields'() {
        console.log('>>>>>>>>>>>>>> input-fields');
        const result = await this.site.issIpPage.searchForm.inputFields(
            this.inputData['fio'],
            this.inputData['dob'],
            this.inputData['reg'],
        );
        return result;
    }

    protected async 'submit-form'() {
        console.log('>>>>>>>>>>>>>> submit-form');
        const result = await this.site.issIpPage.searchForm.submitSearch(60000);
        return result;
    }

    protected async 'solve-captcha'() {
        console.log('>>>>>>>>>>>>>> solve-captcha');
        bag['captchaForm'] = this.searchSubmitResult.captchaForm;
        const captchaSolver = new FsspSefizlicoCaptchaSolver(this);
        bag['captchaSolver'] = captchaSolver;
        const result = await captchaSolver
            .trySolve(this.searchSubmitResult.captchaForm);
        return result;
    }

    protected async '...'() {
        console.log('>>>>>>>>>>>>>> ...');
        this.issIpPageOpenResult = await this.site.issIpPage.open(60000);
    }

    // protected async solveCaptcha(captchaForm: FgrCaptchaForm): Promise<StdResult> {
    //
    //     let i = 0;
    //     let stop = false;
    //     bus.on('parsing.break', () => {
    //         stop = true;
    //     });
    //     while(!stop) {
    //         i++;
    //         if (i > 5) {
    //             return RESET_RESULT;
    //         }
    //
    //         const captchaBase64Result = await captchaForm.getImageBase64(20000);
    //         if (!captchaBase64Result.success) {
    //             return captchaBase64Result;
    //         }
    //
    //         const answer = await services.siteCaptcha.getAnswer(
    //             this.parser,
    //             'start',
    //             captchaBase64Result.data,
    //             15000,
    //         );
    //         // const answer = await this.getCaptchaAnswer(captchaBase64Result.data);
    //         console.log('received captcha answer', answer);
    //
    //         if (!answer.success) {
    //             continue;
    //         }
    //
    //         await captchaForm.inputAnswer(answer.answerText);
    //
    //         const result = await captchaForm.submit(60000);
    //
    //         if (!result.success) {
    //             if (result.from === 'has-wrong-captcha-msg') {
    //                 if (await parsing.step(`solve-captcha-attempt-${i}`)) {
    //                     return RESET_RESULT;
    //                 }
    //                 continue;
    //             }
    //         }
    //         // console.log({ result });
    //         return result;
    //     }
    //
    //     // return {
    //     //     success: false,
    //     //     err: 'solve-captcha-stopped',
    //     // };
    // }
    //
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
