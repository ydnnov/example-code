import { helpers } from '../../helpers/helpers.js';
import { ElementHandle } from 'playwright';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FsspGovRuSite } from './fssp-gov-ru.site.js';
import { FgrIisfResultsPage } from './fgr.iisf-results.page.js';
import { StdResult } from '../../types/common.js';

const CAPTCHA_IMG = '#capchaVisual';
const ANSWER_INP = '#captcha-popup-code';
const SUBMIT_BTN = '#ncapcha-submit';
const WRONG_MSG = '#ncapcha .b-form__label--error';

// const WRONG_MSG = '#ncapcha [text="Неверно введен код"]';

export class FgrCaptchaForm extends EmitsToBus {

    protected eventPrefix = 'fssp-gov-ru.captcha.form';

    protected captchaImageEl: ElementHandle;
    protected answerInputEl: ElementHandle;
    protected submitButtonEl: ElementHandle;

    public readonly resultsPage: FgrIisfResultsPage;

    constructor(public readonly site: FsspGovRuSite) {
        super();

        this.resultsPage = new FgrIisfResultsPage(site);
    }

    get pwpage() {
        return this.site.pwpage;
    }

    public async attach(timeout: number): Promise<StdResult<{},
        'timeout' |
        'smth-wrong-msg'
    >> {
        const state = 'attached';
        const elementWait = [
            this.pwpage.waitForSelector(CAPTCHA_IMG, { state }),
            this.pwpage.waitForSelector(ANSWER_INP, { state }),
            this.pwpage.waitForSelector(SUBMIT_BTN, { state }),
        ];
        const result = await Promise.race([
            Promise.all(elementWait),
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve('timeout');
                }, timeout);
            }),
        ]);
        if (result === 'timeout') {
            return {
                success: false,
                err: 'timeout',
                from: 'fgr-captcha-form.attach',
            };
        }
        this.captchaImageEl = result[0];
        this.answerInputEl = result[1];
        this.submitButtonEl = result[2];
        return {
            success: true,
            from: 'fgr-captcha-form.attach',
        };
    }

    public async getImageBase64(timeout: number): Promise<string | null> {
        return helpers.getImageBase64(this.pwpage, this.captchaImageEl, timeout);
    }

    public async inputAnswer(answer: string) {
        await this.answerInputEl.click();
        await this.pwpage.keyboard.type(answer);
    }

    public async submit(timeout: number): Promise<
        'success' |
        'wrong-answer' |
        'smth-wrong-msg' |
        'timeout'
    > {
        await this.submitButtonEl.click();
        let time: any = new Date();
        let resultsPageOpen = false;
        let wrongCaptchaMessage = false;
        let timeoutElapsed = false;
        let smthWrongMsg = false;
        console.log('submitting');
        await Promise.race([
            this.resultsPage.attach(timeout).then(v => {
                console.log('resultsPageOpen', { v });
                resultsPageOpen = v;
            }),
            this.hasWrongCaptchaMessage(timeout).then(v => {
                console.log('wrongCaptchaMessage', { v });
                wrongCaptchaMessage = v;
            }),
            this.site.waitSomethingWentWrongMessage(5000).then((v) => {
                console.log('smthWrongMsg', { v });
                smthWrongMsg = v;
            }),
            new Promise((resolve) => {
                setTimeout(() => {
                    console.log('timeoutElapsed');
                    timeoutElapsed = true;
                }, timeout);
            }),
        ]);
        time = new Date() - time;
        console.log({ time });
        if (resultsPageOpen) {
            return 'success';
        }
        if (wrongCaptchaMessage) {
            return 'wrong-answer';
        }
        if (smthWrongMsg) {
            return 'smth-wrong-msg';
        }
        if (timeoutElapsed) {
            return 'timeout';
        }
    }

    public async hasWrongCaptchaMessage(timeout): Promise<boolean> {
        const elem = await this.pwpage
            .waitForSelector(WRONG_MSG, { timeout })
            .catch(err => {
            });
        console.log({ elem });
        return !!elem;
    }
}
