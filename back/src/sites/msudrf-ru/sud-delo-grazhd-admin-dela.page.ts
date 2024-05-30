import { bus } from '../../bus.js';
import { pwpage } from '../../pwpage.js';
import { SudDeloResultPage } from './sud-delo-result.page.js';

export class SudDeloGrazhdAdminDelaPage {

    protected fioInputSel = 'input[name=G1_PARTS__NAMESS]';
    protected submitSel = '#button_block .search';

    public async waitReady(timeout: number): Promise<boolean> {
        try {
            await Promise.all([
                pwpage.waitForSelector(this.fioInputSel, { timeout }),
                pwpage.waitForSelector(this.submitSel, { timeout }),
            ]);
            await bus.emit('parser.msudrf-sud-delo.search-page-ready');
            return true;
        } catch (err) {
            await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-search-page');
            return false;
        }
    }

    public async inputFio(fio: string) {
        const fioInputEl = await pwpage.$(this.fioInputSel);
        await fioInputEl.scrollIntoViewIfNeeded();
        await fioInputEl.focus();
        await pwpage.keyboard.type(fio);
    }

    public async submitSearch(timeout: number) {
        const searchButtonEl = await pwpage.$(this.submitSel);
        await searchButtonEl.click();
        const page = new SudDeloResultPage();
        const isReady = await page.waitReady(timeout);
        return isReady ? page : null;
    }
}
