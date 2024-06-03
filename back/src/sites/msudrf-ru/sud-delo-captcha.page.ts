import { bus } from '../../bus.js';
import { pwpage } from '../../pwpage.js';
import { helpers } from '../../helpers/helpers.js';
import { SudDeloZaprosyOpfrPage } from './sud-delo-zaprosy-opfr.page.js';

export class SudDeloCaptchaPage {

    protected inputSel = '#kcaptchaForm [name=captcha-response]';
    protected submitSel = '#kcaptchaForm button[type=submit]';
    protected captchaImageSel = 'img[src="/captcha.php"]';

    public async waitReady(timeout: number): Promise<boolean> {
        try {
            await Promise.all([
                pwpage.waitForSelector(this.inputSel, { timeout }),
                pwpage.waitForSelector(this.submitSel, { timeout }),
                pwpage.waitForSelector(this.captchaImageSel, { timeout }),
            ]);
            await bus.emit('parser.msudrf-sud-delo.captcha-page-ready');
            return true;
        } catch (err) {
            await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-captcha-page');
            return false;
        }
    }

    public async getCaptchaBase64(timeout: number) {
        const imageElem = await pwpage.$(this.captchaImageSel);
        return helpers.getImageBase64(pwpage, imageElem, timeout);
    }

    public async inputCaptchaAnswer(answer: string) {
        const inputEl = await pwpage.$(this.inputSel);
        await inputEl.focus();
        await pwpage.keyboard.type(answer);
    }

    public async submitCaptcha(timeout: number): Promise<SudDeloZaprosyOpfrPage | null> {
        const submitEl = await pwpage.$(this.submitSel);
        await submitEl.click();
        const page = new SudDeloZaprosyOpfrPage();
        const isReady = await page.waitReady(timeout);
        return isReady ? page : null;
    }
}
