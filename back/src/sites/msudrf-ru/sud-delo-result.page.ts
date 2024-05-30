import { bus } from '../../bus.js';
import { pwpage } from '../../pwpage.js';

export class SudDeloResultPage {

    protected resultContainerSel = '#search_results';

    public async waitReady(timeout: number): Promise<boolean> {
        try {
            await Promise.all([
                pwpage.waitForSelector(this.resultContainerSel, { timeout }),
            ]);
            await bus.emit('parser.msudrf-sud-delo.captcha-page-ready');
            return true;
        } catch (err) {
            await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-captcha-page');
            return false;
        }
    }

    public async getResultHtml(): Promise<string> {
        return pwpage.content();
    }
}
