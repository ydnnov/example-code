import { services } from '../services/services.js';
import { helpers } from '../helpers/helpers.js';
import { bus } from '../bus.js';
import * as cheerio from 'cheerio';
import { OperationResult } from '../types/common.js';
import { env } from '../envconf.js';
import fs from 'node:fs';

export class MsudrfSudDeloParser {

    public async run(fio: string)
        : Promise<OperationResult<string>> {

        const page = await services.headless.getPage();

        const url = 'http://32.sar.msudrf.ru/modules.php?name=sud_delo&op=hl';
        await page.goto(url);

        await bus.emitAsync('msudrf-sud-delo-parser:opened-start-page');

        const captchaAnswerText = await this.solveCaptcha();

        const captchaInputEl = await page.$('#kcaptchaForm [name=captcha-response]');
        await captchaInputEl.focus();
        await page.keyboard.type(captchaAnswerText);
        const submitEl = await page.$('#kcaptchaForm button[type=submit]');
        await submitEl.click();

        // const linkEl = await page.getByText('Гражданские и административные дела');
        await helpers.sleep(1000);
        const linkEl = await page.$('#type_1');
        console.log(linkEl);
        await linkEl.click();

        await helpers.sleep(1000);
        const inputEl = await page.$('[name=G1_PARTS__NAMESS]');
        await inputEl.scrollIntoViewIfNeeded();
        await inputEl.focus();
        await helpers.sleep(1000);
        await page.keyboard.type(fio);
        await helpers.sleep(1000);

        const searchButtonEl = await page.$('#button_block .search');
        await searchButtonEl.click();

        await page.waitForSelector('#tablcont');

        const resultData = await page.content();

        // console.log(resultHtml);

        return {
            success: true,
            resultData,
        };
    }

    public extractJson(ptaskId: number) {

        const filename = `${env.STORAGE_PATH}/result_html/${ptaskId}.html`;

        if (!fs.existsSync(filename)) {
            throw new Error(`Could not find html file`);
        }

        const html = fs.readFileSync(filename).toString();
        const $ = cheerio.load(html);
        const trElems = $('#tablcont tr');
        const resultItems = [];
        for (let i = 1; i < trElems.length; i++) {
            const tdElems = $(trElems[i]).children('td');
            const resultItem = {
                caseNumber: $(tdElems[0]).text(),
                receivedDate: $(tdElems[1]).text(),
                caseInfo: $(tdElems[2]).text(),
                judgeFio: $(tdElems[3]).text(),
                decisionDate: $(tdElems[4]).text(),
                decision: $(tdElems[5]).text(),
                judicialActs: $(tdElems[6]).text(),
            };
            resultItems.push(resultItem);
        }

        return resultItems;
    }

    public async solveCaptcha() {

        // Usage:
        //
        // services.siteCaptcha.events.on(
        //     'captcha:create-answer-request:image-find-or-create',
        //     (manager, imageBase64) => {
        //         return manager.findOneBy(CaptchaImageEntity, {
        //             id: 2,
        //         });
        //     });

        const page = await services.headless.getPage();
        const imageElem = await page.$('img[src="/captcha.php"]');
        const imageBase64 = await helpers.getImageBase64(
            page,
            imageElem,
        );
        const ansreqEnt = await services.siteCaptcha
            .createAnswerRequest(imageBase64);

        return new Promise((resolve, reject) => {
            bus.once('captcha:answer-received', (answerText) => {
                resolve(answerText);
            });
        });
    }

}
