import { bus } from '../../bus.js';
import { pwpage } from '../../pwpage.js';
import { SudDeloGrazhdAdminDelaPage } from './sud-delo-grazhd-admin-dela.page.js';

export class SudDeloZaprosyOpfrPage {

    protected grazhdAdminDelaLinkSel = '#type_1';

    public async waitReady(timeout: number) {
        try {
            await pwpage.waitForSelector(this.grazhdAdminDelaLinkSel, { timeout });
            await bus.emit('parser.msudrf-sud-delo.zaprosy-opfr-page-opened');
            return true;
        } catch (err) {
            await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-zaprosy-opfr-page');
            return false;
        }
    }

    public async clickGrazhdAdminDelaLink(timeout: number)
        : Promise<SudDeloGrazhdAdminDelaPage> {
        const linkEl = await pwpage.$(this.grazhdAdminDelaLinkSel);
        await linkEl.click();
        const page = new SudDeloGrazhdAdminDelaPage();
        const isReady = await page.waitReady(timeout);
        return isReady ? page : null;
    }
}
