import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { pwpage, pwpageRecreate } from '../../pwpage.js';
import { FsspGovRuSite } from '../../sites/fssp-gov-ru/fssp-gov-ru.site.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { services } from '../../services/services.js';
import { bus } from '../../bus.js';
import { FgrCaptchaForm } from '../../sites/fssp-gov-ru/fgr.captcha.form.js';
import { RaceResult, StdResult } from '../../types/common.js';
import { parsing } from '../../helpers/parsing.js';
import { FsspSefizlicoParser } from './fssp-sefizlico.parser.js';
import { Page as PlaywrightPage } from 'playwright';
import { helpers } from '../../helpers/helpers.js';
import { bag } from '../../bag.js';
import { FsspSefizlicoAttemptHandler } from './fssp-sefizlico.attempt-handler.js';

const RESET_RESULT: StdResult = {
    success: false,
    err: 'parser-reset',
};

export class FsspSefizlicoCaptchaSolver extends EmitsToBus {

    protected eventPrefix = 'fssp-sefizlico.captcha-solver';

    constructor(
        public readonly attempt: FsspSefizlicoAttemptHandler,
    ) {
        super();
    }

    get parser() {
        return this.attempt.parser;
    }

    get pwpage() {
        return this.attempt.pwpage;
    }

    async trySolve(captchaForm: FgrCaptchaForm): Promise<RaceResult> {
        const captchaBase64Result = await captchaForm.getImageBase64(20000);
        if (!captchaBase64Result.success) {
            return captchaBase64Result;
        }

        const answer = await services.siteCaptcha.waitForAnswer(
            this.parser,
            'start',
            captchaBase64Result.data,
            15000,
        );
        // const answer = await this.getCaptchaAnswer(captchaBase64Result.data);
        console.log('received captcha answer', answer);

        if (!answer.success) {
            return answer;
        }

        await captchaForm.inputAnswer(answer.answer);
        await helpers.sleep(2000);
        const result = await captchaForm.submit(60000);

        // console.log({ result });
        return result;
    }

    protected async old_solveCaptcha(captchaForm: FgrCaptchaForm): Promise<StdResult> {

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
