import fs from 'node:fs';
import * as cheerio from 'cheerio';
import { env } from '../envconf.js';
import { bus } from '../bus.js';
import { services } from '../services/services.js';
import { helpers } from '../helpers/helpers.js';
import { OperationResult } from '../types/common.js';

export class TerritorialnayaPodsudnostParser {

    public async run(address: string)
        : Promise<OperationResult<string>> {

        const page = await services.headless.getPage();

        const url = 'http://32.sar.msudrf.ru/modules.php?name=terr';
        // try {
        await page.goto(url);
        // } catch (err) {
        //     console.log(err);
        // }

        await bus.emit('parser.territorialnaya-podsudnost.opened-start-page');

        const addressInputEl = await page.$('#searchInput input');
        await addressInputEl.focus();
        await page.keyboard.type(address);

        return {
            success: true,
            resultData: 'qwe',
        };

        // const captchaAnswerText = await this.solveCaptcha();
        //
        // const captchaInputEl = await page.$('#kcaptchaForm [name=captcha-response]');
        // await captchaInputEl.focus();
        // await page.keyboard.type(captchaAnswerText);
        // const submitEl = await page.$('#kcaptchaForm button[type=submit]');
        // await submitEl.click();
        //
        // // const linkEl = await page.getByText('Гражданские и административные дела');
        // await helpers.sleep(1000);
        // const linkEl = await page.$('#type_1');
        // console.log(linkEl);
        // await linkEl.click();
        //
        // await helpers.sleep(1000);
        // const inputEl = await page.$('[name=G1_PARTS__NAMESS]');
        // await inputEl.scrollIntoViewIfNeeded();
        // await inputEl.focus();
        // await helpers.sleep(1000);
        // await page.keyboard.type(fio);
        // await helpers.sleep(1000);
        //
        // const searchButtonEl = await page.$('#button_block .search');
        // await searchButtonEl.click();
        //
        // await page.waitForSelector('#tablcont');
        //
        // const resultData = await page.content();
        //
        // // console.log(resultHtml);

        return {
            success: true,
            resultData: 'qwe',
        };
    }

    public extractJson(ptaskId: number) {

        // const filename = `${env.STORAGE_PATH}/result_html/${ptaskId}.html`;
        //
        // if (!fs.existsSync(filename)) {
        //     throw new Error(`Could not find html file`);
        // }
        //
        // const html = fs.readFileSync(filename).toString();
        // const $ = cheerio.load(html);
        // const trElems = $('#tablcont tr');
        // const resultItems = [];
        // for (let i = 1; i < trElems.length; i++) {
        //     const tdElems = $(trElems[i]).children('td');
        //     const resultItem = {
        //         caseNumber: $(tdElems[0]).text(),
        //         receivedDate: $(tdElems[1]).text(),
        //         caseInfo: $(tdElems[2]).text(),
        //         judgeFio: $(tdElems[3]).text(),
        //         decisionDate: $(tdElems[4]).text(),
        //         decision: $(tdElems[5]).text(),
        //         judicialActs: $(tdElems[6]).text(),
        //     };
        //     resultItems.push(resultItem);
        // }
        //
        // return resultItems;
    }

}
