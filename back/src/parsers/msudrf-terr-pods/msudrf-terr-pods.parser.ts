import fs from 'node:fs';
import * as cheerio from 'cheerio';
import { env } from '../../envconf.js';
import { bus } from '../../bus.js';
import { services } from '../../services/services.js';
import { helpers } from '../../helpers/helpers.js';
import { OperationResult } from '../../types/common.js';
import { Request } from 'playwright';
import { ParserBase } from '../parser-base.js';

export class MsudrfTerrPodsParser extends ParserBase {

    constructor(protected address: string) {
        super();
    }

    // public currentStage = 'none';
    // // public lastStageSuccess;
    // public lastStageStartTime;
    //
    // constructor(
    //     public address: string,
    //     public options?: {
    //         openPageTimeoutMs: number
    //         inputAddressTimeoutMs: number
    //     },
    // ) {
    // }
    //
    // protected async onRequestFailed(request: Request) {
    //     await bus.emit('parser.terr-pods.request-failed', request);
    //     // switch (this.currentStage) {
    //     //     case 'started': {
    //     //         await bus.emit('parser.terr-pods.open-start-page.failed');
    //     //         break;
    //     //     }
    //     //     case 'opened-start-page': {
    //     //         await bus.emit('parser.terr-pods.input-address.failed');
    //     //         break;
    //     //     }
    //     // }
    //     // await bus.emit('parser.terr-pods.input-address.failed');
    //     // console.log(request);
    // }

    public async run(): Promise<OperationResult<string>> {
        //
        //     await bus.emit('parser.terr-pods.started');
        //
        //     this.currentStage = 'started';
        //     this.lastStageStartTime = new Date();
        //     // console.log(this.lastStageStartTime);
        //     // return;
        //
        //     const page = await services.headless.getPage();
        //
        //     page.on('requestfailed', this.onRequestFailed.bind(this));
        //
        //     // const url = 'https://google.com';
        //     const url = 'http://32.sar.msudrf.ru/modules.php?name=terr';
        //
        //     await page.goto(url);
        //
        //     const addressInputEl = await page.$('#searchInput input');
        //
        //     // this.lastStageSuccess = !!addressInputEl;
        //
        //     const timeTaken = new Date() - this.lastStageStartTime;
        //
        //     if (addressInputEl) {
        //         this.currentStage = 'opened-start-page';
        //         await bus.emit(
        //             'parser.terr-pods.open-start-page.success',
        //             { timeTaken },
        //         );
        //     } else {
        //         await bus.emit(
        //             'parser.terr-pods.open-start-page.failed',
        //             { timeTaken },
        //         );
        //         return {
        //             success: false,
        //             err: 'open-start-page.failed',
        //         };
        //     }
        //
        //     await addressInputEl.focus();
        //     await page.keyboard.type(this.address);
        //
        //     return {
        //         success: true,
        //         resultData: 'qwe',
        //     };
        //
        //     // const captchaAnswerText = await this.solveCaptcha();
        //     //
        //     // const captchaInputEl = await page.$('#kcaptchaForm [name=captcha-response]');
        //     // await captchaInputEl.focus();
        //     // await page.keyboard.type(captchaAnswerText);
        //     // const submitEl = await page.$('#kcaptchaForm button[type=submit]');
        //     // await submitEl.click();
        //     //
        //     // // const linkEl = await page.getByText('Гражданские и административные дела');
        //     // await helpers.sleep(1000);
        //     // const linkEl = await page.$('#type_1');
        //     // console.log(linkEl);
        //     // await linkEl.click();
        //     //
        //     // await helpers.sleep(1000);
        //     // const inputEl = await page.$('[name=G1_PARTS__NAMESS]');
        //     // await inputEl.scrollIntoViewIfNeeded();
        //     // await inputEl.focus();
        //     // await helpers.sleep(1000);
        //     // await page.keyboard.type(fio);
        //     // await helpers.sleep(1000);
        //     //
        //     // const searchButtonEl = await page.$('#button_block .search');
        //     // await searchButtonEl.click();
        //     //
        //     // await page.waitForSelector('#tablcont');
        //     //
        //     // const resultData = await page.content();
        //     //
        //     // // console.log(resultHtml);
        //     //
        //     // return {
        //     //     success: true,
        //     //     resultData: 'qwe',
        //     // };
    }

    extractJson(html: string) {
    }

    // // public extractJson(ptaskId: number) {
    // //
    // //     const filename = `${env.STORAGE_PATH}/result_html/${ptaskId}.html`;
    // //
    // //     if (!fs.existsSync(filename)) {
    // //         throw new Error(`Could not find html file`);
    // //     }
    // //
    // //     const html = fs.readFileSync(filename).toString();
    // //     const $ = cheerio.load(html);
    // //     const trElems = $('#tablcont tr');
    // //     const resultItems = [];
    // //     for (let i = 1; i < trElems.length; i++) {
    // //         const tdElems = $(trElems[i]).children('td');
    // //         const resultItem = {
    // //             caseNumber: $(tdElems[0]).text(),
    // //             receivedDate: $(tdElems[1]).text(),
    // //             caseInfo: $(tdElems[2]).text(),
    // //             judgeFio: $(tdElems[3]).text(),
    // //             decisionDate: $(tdElems[4]).text(),
    // //             decision: $(tdElems[5]).text(),
    // //             judicialActs: $(tdElems[6]).text(),
    // //         };
    // //         resultItems.push(resultItem);
    // //     }
    // //
    // //     return resultItems;
    // // }
}
