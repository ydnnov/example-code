import { bus } from '../../bus.js';
import { pwpage } from '../../pwpage.js';
import { SudDeloCaptchaPage } from './sud-delo-captcha.page.js';

export class MsudrfHomePage {

    protected pageUrl = 'http://32.sar.msudrf.ru/';
    protected sudDeloLinkSel = 'a[href="/modules.php?name=sud_delo&op=hl"]';

    public async open() {
        await bus.emit('parser.msudrf-home-page.opening');
        await pwpage.goto(this.pageUrl);
    }

    public async waitReady(timeout: number): Promise<boolean> {
        try {
            await Promise.all([
                pwpage.waitForSelector(this.sudDeloLinkSel, { timeout }),
            ]);
            await bus.emit('parser.msudrf-home-page.ready');
            return true;
        } catch (err) {
            await bus.emit('parser.msudrf-home-page.error.failed-to-open');
            return false;
        }
    }

    public async openSudDeloPage(timeout: number)
        : Promise<SudDeloCaptchaPage | null> {
        const linkEl = await pwpage.$(this.sudDeloLinkSel);
        await linkEl.click();
        const page = new SudDeloCaptchaPage();
        const isReady = await page.waitReady(timeout);
        return isReady ? page : null;
    }
}
