import { MsudrfHomePage } from './msudrf-home.page.js';

export class MsudrfSite {

    public async openHomePage(timeout: number): Promise<MsudrfHomePage> {
        const page = new MsudrfHomePage();
        await page.open();
        const isReady = await page.waitReady(timeout);
        return isReady ? page : null;
    }
}
