import { services } from '../services/services.js';

export class MsudrfSudDeloParser {
    public async openStartPage() {
        const page = await services.headless.getPage();
        const url = 'http://32.sar.msudrf.ru/modules.php?name=sud_delo&op=hl';
        await page.goto(url);
    }

    public async solveCaptcha() {
        const page = await services.headless.getPage();
    }

    public async getImageBase64(selector: string): Promise<string> {
        const page = await services.headless.getPage();
        const result = await page.evaluate((s) => {
            const captchaImg = $(s)[0];
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = captchaImg.width;
            canvas.height = captchaImg.height;
            context.drawImage(captchaImg, 0, 0);
            const base64Data = canvas.toDataURL('image/png');
            return base64Data;
        }, selector);
        return result;
    }
}
