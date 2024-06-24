import { helpers } from '../../helpers/helpers.js';
import { ElementHandle } from 'playwright';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { ParsingStepTimeoutError } from '../../errors/parsing/parsing-step-timeout.error.js';
import { FsspGovRuSite } from './fssp-gov-ru.site.js';

const CAPTCHA_IMG = '#capchaVisual';
const ANSWER_INP = '#captcha-popup-code';

export class FgrCaptchaForm extends EmitsToBus {

    protected eventPrefix = 'fssp-gov-ru.captcha.form';

    protected captchaImageEl: ElementHandle;
    protected answerInputEl: ElementHandle;

    constructor(public readonly site: FsspGovRuSite) {
        super();
    }

    get pwpage() {
        return this.site.pwpage;
    }

    public async attach(timeout: number) {
        const state = 'attached';
        const noop = (err) => {
        };
        const elementWait = [
            this.pwpage.waitForSelector(CAPTCHA_IMG, { timeout, state }).catch(noop),
            this.pwpage.waitForSelector(ANSWER_INP, { timeout, state }).catch(noop),
        ];
        const result = await Promise.race([
            Promise.all(elementWait),
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const error = new ParsingStepTimeoutError(
                        this.site.taskAttemptEntity,
                        'captcha-form-attach',
                    );
                    reject(error);
                }, timeout);
            }),
        ]);
        this.captchaImageEl = result[0];
        this.answerInputEl = result[1];
    }

    public async getImageBase64(timeout: number): Promise<string | null> {
        return helpers.getImageBase64(this.pwpage, this.captchaImageEl, timeout);
    }

    public async inputAnswer(answer: string) {
        await this.answerInputEl.click();
        await this.pwpage.keyboard.type(answer);
    }

    public async submit() {
    }
}
