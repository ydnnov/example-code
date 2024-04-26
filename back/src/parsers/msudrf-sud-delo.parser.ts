import { services } from '../services/services.js';
import { helpers } from '../helpers/helpers.js';

export class MsudrfSudDeloParser {
    public async openStartPage() {
        const page = await services.headless.getPage();
        const url = 'http://32.sar.msudrf.ru/modules.php?name=sud_delo&op=hl';
        await page.goto(url);
    }

    public async solveCaptcha() {
        const page = await services.headless.getPage();
        const imageElem = await page.$('img[src="/captcha.php"]');
        const imageBase64 = await helpers.getImageBase64(
            page,
            imageElem,
        );
        console.log(imageBase64);
    }

}
