import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { pwpage, pwpageRecreate } from '../../pwpage.js';
import { FsspGovRuSite } from '../../sites/fssp-gov-ru/fssp-gov-ru.site.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { services } from '../../services/services.js';
import { bus } from '../../bus.js';
import { FgrCaptchaForm } from '../../sites/fssp-gov-ru/fgr.captcha.form.js';
import { StdResult } from '../../types/common.js';
import { parsing } from '../../helpers/parsing.js';
import { FgrSfParser } from './fgr-sf.parser.js';
import { Page as PlaywrightPage } from 'playwright';
import { helpers } from '../../helpers/helpers.js';
import { bag } from '../../bag.js';
import { FgrSfAttemptHandler } from './fgr-sf.attempt-handler.js';

const RESET_RESULT: StdResult = {
    success: false,
    err: 'parser-reset',
};

export class FgrSfCaptchaSolver extends EmitsToBus {

    protected eventPrefix = 'fssp-sefizlico.captcha-solver';

    constructor(
        public readonly attempt: FgrSfAttemptHandler,
    ) {
        super();
    }

    get pwpage() {
        return this.attempt.pwpage;
    }

    public async solve(): Promise<StdResult> {

        const site = new FsspGovRuSite(pwpage, this.attemptEntity);

        if (await parsing.step('open-page')) {
            return RESET_RESULT;
        }

        const issIpPageOpenResult = await site.issIpPage.open(60000);
        if (!issIpPageOpenResult.success) {
            return issIpPageOpenResult;
        }

        if (await parsing.step('input-fields')) {
            return RESET_RESULT;
        }
        await site.issIpPage.searchForm.inputFields(
            this.inputData['fio'],
            this.inputData['dob'],
            this.inputData['reg'],
        );

        if (await parsing.step('submit-form')) {
            return RESET_RESULT;
        }
        const searchSubmitResult = await site.issIpPage.searchForm.submitSearch(60000);
        if (!searchSubmitResult.success) {
            return searchSubmitResult;
        }

        if (await parsing.step('solve-captcha')) {
            return RESET_RESULT;
        }
        const solveCaptchaResult = await this.solveCaptcha(searchSubmitResult.captchaForm);

        if (!solveCaptchaResult.success) {
            console.log({ solveCaptchaResult });
            return solveCaptchaResult;
        }

        const rp = await searchSubmitResult.captchaForm.resultsPage;

        // const rp = new FgrIisfResultsPage(new FsspGovRuSite(page));
        const pagination = await rp.getPagination();
        const numFound = await rp.getNumFound();
        console.log({ pagination, numFound });
        await rp.openNextPage();
        // bag['rp'] = rp;


        if (await parsing.step('before-...')) {
            return RESET_RESULT;
        }
        // console.log({ solveCaptchaResult });
    }

    protected async solveCaptcha(captchaForm: FgrCaptchaForm): Promise<StdResult> {

        let i = 0;
        let stop = false;
        bus.on('parsing.break', () => {
            stop = true;
        });
        while(!stop) {
            i++;
            if (i > 5) {
                return RESET_RESULT;
            }

            const captchaBase64Result = await captchaForm.getImageBase64(20000);
            if (!captchaBase64Result.success) {
                return captchaBase64Result;
            }

            const answer = await services.siteCaptcha.getAnswer(
                this.parser,
                'start',
                captchaBase64Result.data,
                15000,
            );
            // const answer = await this.getCaptchaAnswer(captchaBase64Result.data);
            console.log('received captcha answer', answer);

            if (!answer.success) {
                continue;
            }

            await captchaForm.inputAnswer(answer.answerText);

            const result = await captchaForm.submit(60000);

            if (!result.success) {
                if (result.from === 'has-wrong-captcha-msg') {
                    if (await parsing.step(`solve-captcha-attempt-${i}`)) {
                        return RESET_RESULT;
                    }
                    continue;
                }
            }
            // console.log({ result });
            return result;
        }

        // return {
        //     success: false,
        //     err: 'solve-captcha-stopped',
        // };
    }

}
