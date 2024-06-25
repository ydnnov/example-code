import { helpers } from '../../helpers/helpers.js';
import { ElementHandle } from 'playwright';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FsspGovRuSite } from './fssp-gov-ru.site.js';
import { FgrIisfResultsPage } from './fgr.iisf-results.page.js';
import { RaceResult, StdResult } from '../../types/common.js';

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

    public async attach(timeout: number): Promise<RaceResult<{},
        'timeout' |
        'smth-wrong-msg'
    >> {
        const from = 'fgr-captcha-form.attach';
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
                from,
            };
        }
        this.captchaImageEl = result[0];
        this.answerInputEl = result[1];
        this.submitButtonEl = result[2];
        return {
            success: true,
            from,
        };
    }

    // public async getImageBase64(timeout: number): Promise<string | null> {
    //     return helpers.getImageBase64(this.pwpage, this.captchaImageEl, timeout);
    // }

    public async getImageBase64(timeout: number): Promise<RaceResult<
        { data: string },
        'empty-image' | 'timeout'
    >> {
        const from = 'helpers.get-image-base64';
        try {
            const result = await helpers.getImageBase64(this.pwpage, this.captchaImageEl, timeout);
            if (!result.length) {
                return {
                    success: false,
                    err: 'empty-image',
                    from,
                };
            }
            return {
                success: true,
                data: result,
                from,
            };
        } catch (err) {
            console.log('getImageBase64 timeout');
            return {
                success: false,
                err: 'timeout',
                from,
            };
        }
    }

    public async inputAnswer(answer: string) {
        const wrongMsgEl = await this.pwpage.$(WRONG_MSG);
        if (wrongMsgEl) {
            await wrongMsgEl.click();
        }
        await this.attach(5000);
        await this.answerInputEl.click();
        await this.pwpage.keyboard.type(answer);
    }

    public async submit(timeout: number): Promise<RaceResult<
        {},
        'has-wrong-captcha-msg' |
        'smth-wrong-msg' |
        'timeout'
    >> {
        const from = 'captcha-submit';
        await this.submitButtonEl.click();
        let time: any = new Date();
        console.log('submitting');
        const result = await Promise.race([
            this.resultsPage.attach(timeout),
            this.handleWrongCaptchaMessage(),
            this.site.handleSomethingWentWrongMessage(),
            helpers.raceTimeout(from, timeout),
        ]);
        time = new Date() - time;
        console.log({ time });
        return result;
    }

    public async handleWrongCaptchaMessage(): Promise<RaceResult> {
        const from = 'has-wrong-captcha-msg';
        await this.pwpage.waitForSelector(WRONG_MSG, { state: 'attached' });
        return {
            success: false,
            err: from,
            from,
        };
    }
}
