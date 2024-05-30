import fs from 'node:fs';
import * as cheerio from 'cheerio';
import { env } from '../../envconf.js';
import { bus } from '../../bus.js';
import { services } from '../../services/services.js';
import { helpers } from '../../helpers/helpers.js';
import { OperationResult } from '../../types/common.js';
import { AppEvent } from '../../shared/classes/app-event.js';
import { SudDeloCaptchaPage } from '../../sites/msudrf-ru/sud-delo-captcha.page.js';
import { SudDeloZaprosyOpfrPage } from '../../sites/msudrf-ru/sud-delo-zaprosy-opfr.page.js';
import { MsudrfSite } from '../../sites/msudrf-ru/msudrf.site.js';

export class MsudrfSudDeloParser {

    constructor(protected fio: string) {
    }

    public async run(): Promise<OperationResult<string>> {

        const site = new MsudrfSite();

        let lastError;

        for (let i = 0; i < 3; i++) {
            const homePage = await site.openHomePage(5000);
            if (!homePage) {
                await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-home-page');
                lastError = 'Failed to open home page, site might be down';
                continue;
            }
            await bus.emit('parser.msudrf-sud-delo.opened-home-page');

            const sudDeloPage = await homePage.openSudDeloPage(5000);
            if (!sudDeloPage) {
                await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-sud-delo-page');
                lastError = 'Failed to open page sudebnoye deloproizvodstvo';
                continue;
            }

            const captchaAnswer = await this.getCaptchaAnswer(sudDeloPage);
            await bus.emit('captcha.waiting-answer-confirmation');
            await sudDeloPage.inputCaptchaAnswer(captchaAnswer);
            const zaprosyOpfrPage = await sudDeloPage.submitCaptcha(5000);
            if (!zaprosyOpfrPage) {
                await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-sud-delo-page');
                lastError = 'Failed to solve captcha';
                continue;
            }

            const searchPage = await zaprosyOpfrPage.clickGrazhdAdminDelaLink(5000);
            if (!searchPage) {
                await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-search-page');
                lastError = 'Failed to open search page';
                continue;
            }

            await searchPage.inputFio(this.fio);
            const resultPage = await searchPage.submitSearch();

        }

        if (lastError) {
            return {
                success: true,
                resultData: 'qweasd',
            };
        } else {
            return {
                success: false,
                err: 'Failed to open home page, site might be down',
            };
        }

        // let result;
        //
        // result = await this.passCaptchaPage();
        // if (!result) {
        //     await bus.emit('parser.msudrf-sud-delo.error.failed-to-pass-captcha-page');
        //     return {
        //         success: false,
        //         err: 'Failed to pass captcha',
        //     };
        // }

        // const page = await services.headless.getPage();
        //
        // const url = 'http://32.sar.msudrf.ru/modules.php?name=sud_delo&op=hl';
        // await page.goto(url);
        //
        // await bus.emit('parser.msudrf-sud-delo.opened-start-page');
        //
        // const captchaAnswerText = await this.solveCaptcha();
        //
        // const captchaInputEl = await page.$('#kcaptchaForm [name=captcha-response]');
        // await captchaInputEl.focus();
        // await page.keyboard.type(captchaAnswerText);
        // const submitEl = await page.$('#kcaptchaForm button[type=submit]');
        // await submitEl.click();
        // if (!submitEl) {
        //     bus.emit('parser.msudrf-sud-delo.error.no-captcha-submit-button');
        // }
        //
        // if (!await this.passCaptchaPage()) {
        //     return {
        //         success: false,
        //         err: 'Failed to pass captcha',
        //     };
        // }
        //
        //     // const linkEl = await page.getByText('Гражданские и административные дела');
        //     await helpers.sleep(1000);
        //     const linkEl = await page.$('#type_1');
        //     if (!linkEl) {
        //         bus.emit('parser.msudrf-sud-delo.error.no-sud-delo-button');
        //     }
        //     // console.log({ linkEl });
        //     await linkEl.click();
        //
        //     await helpers.sleep(1000);
        //     const inputEl = await page.$('[name=G1_PARTS__NAMESS]');
        //     if (!inputEl) {
        //         bus.emit('parser.msudrf-sud-delo.error.no-fio-input');
        //     }
        //     await inputEl.scrollIntoViewIfNeeded();
        //     await inputEl.focus();
        //     // await helpers.sleep(1000);
        //     await page.keyboard.type(fio);
        //     // await helpers.sleep(1000);
        //
        //     const searchButtonEl = await page.$('#button_block .search');
        //     if (!searchButtonEl) {
        //         bus.emit('parser.msudrf-sud-delo.error.no-search-button');
        //     }
        //     await searchButtonEl.click();
        //
        //     try {
        //         await page.waitForSelector('#tablcont');
        //     } catch (err) {
        //         bus.emit('parser.msudrf-sud-delo.error.no-result-table');
        //     }
        //
        //     const resultData = await page.content();
        //
        //     // console.log(resultHtml);
        //
        //     return {
        //         success: true,
        //         resultData,
        //     };
    }

    // public extractJson(ptaskId: number) {
    //
    //     const filename = `${env.STORAGE_PATH}/result_html/${ptaskId}.html`;
    //
    //     if (!fs.existsSync(filename)) {
    //         throw new Error(`Could not find html file`);
    //     }
    //
    //     const html = fs.readFileSync(filename).toString();
    //     const $ = cheerio.load(html);
    //     const trElems = $('#tablcont tr');
    //     const resultItems = [];
    //     for (let i = 1; i < trElems.length; i++) {
    //         const tdElems = $(trElems[i]).children('td');
    //         const resultItem = {
    //             caseNumber: $(tdElems[0]).text(),
    //             receivedDate: $(tdElems[1]).text(),
    //             caseInfo: $(tdElems[2]).text(),
    //             judgeFio: $(tdElems[3]).text(),
    //             decisionDate: $(tdElems[4]).text(),
    //             decision: $(tdElems[5]).text(),
    //             judicialActs: $(tdElems[6]).text(),
    //         };
    //         resultItems.push(resultItem);
    //     }
    //
    //     return resultItems;
    // }
    //
    protected async passCaptchaPage() {
        let isReady;
        for (let i = 0; i < 3; i++) {
            const captchaPage = new SudDeloCaptchaPage();
            await captchaPage.open();
            isReady = await captchaPage.waitReady(5000);
            if (!isReady) {
                continue;
            }
            const captchaAnswer = await this.getCaptchaAnswer(captchaPage);
            await captchaPage.inputAnswer(captchaAnswer);
            await captchaPage.submit();
            await bus.emit('captcha.waiting-answer-confirmation');

            const zaprosyOpfrPage = new SudDeloZaprosyOpfrPage();
            isReady = await zaprosyOpfrPage.waitReady(5000);
            await zaprosyOpfrPage.clickGrazhdAdminDelaLink();
            await helpers.sleep(5000);
            // const linkEl = await page.$('type_1');
            // const linkEl = await page.getByText('Гражданские и административные дела');
            // console.log({linkEl});
            // if (linkEl) {
            //     await bus.emit('captcha.answer-confirmed');
            //     return true;
            // }
        }
        return false;
    }

    protected async getCaptchaAnswer(
        captchaPage: SudDeloCaptchaPage,
    ): Promise<string> {
        const imageBase64 = await captchaPage.getCaptchaBase64();
        const ansreqEnt = await services.siteCaptcha
            .createAnswerRequest(imageBase64);
        const result = new Promise<string>((resolve, reject) => {
            bus.once('captcha.answer-received', (appEvent: AppEvent<any>) => {
                console.log({ 'appEvent.payload': appEvent.payload });
                resolve(appEvent.payload);
            });
        });

        // await services.siteCaptcha.getFromRucaptchaCom(imageBase64);

        return result;
    }
}
