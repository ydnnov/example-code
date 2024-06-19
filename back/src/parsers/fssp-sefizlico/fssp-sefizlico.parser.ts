import * as cheerio from 'cheerio';
import { bus } from '../../bus.js';
import { services } from '../../services/services.js';
import { StdResult } from '../../types/common.js';
import { AppEvent } from '../../shared/classes/app-event.js';
import { ParserBase } from '../parser-base.js';
import { pwpage, pwpageRecreate, pwpageSet } from '../../pwpage.js';
import { CaptchaAnswerRequestEntity } from '../../entities/captcha-answer-request.entity.js';
import { helpers } from '../../helpers/helpers.js';

type GetCaptchaAnswerResultType = {
    answerRequestEntity: CaptchaAnswerRequestEntity,
    success: true
    answer: string
} | {
    answerRequestEntity: CaptchaAnswerRequestEntity | null,
    success: false
    err: any
}

export class FsspSefizlicoParser extends ParserBase {

    protected eventPrefix = 'fssp-sefizlico.parser';

    constructor(
        protected fio: string,
        protected dob: string,
        protected reg: string,
    ) {
        super();
    }

    public async run(): Promise<StdResult<{ resultHtml: string }>> {

        this.emit('started');

        let lastError;

        for (let i = 0; i < 1; i++) {

            await this.emit('attempt', { num: i + 1 });

            await pwpageRecreate();

            await pwpage.goto('https://fssp.gov.ru/iss/ip/');

            const regionInputEl = await pwpage.waitForSelector('#region_id_chosen input', {
                state: 'attached',
            });
            await regionInputEl.focus();
            await pwpage.keyboard.type(this.reg);
            await pwpage.keyboard.press('Enter');

            const fioParts = this.fio.split(' ');
            if (fioParts.length !== 3) {
                throw new Error(`Invalid fio: "${this.fio}"`);
            }
            const lastNameInputEl = await pwpage.waitForSelector('[name="is[last_name]"]', {
                state: 'attached',
            });
            await lastNameInputEl.focus();
            await pwpage.keyboard.type(fioParts[0]);
            const firstNameInputEl = await pwpage.waitForSelector('[name="is[first_name]"]', {
                state: 'attached',
            });
            await firstNameInputEl.focus();
            await pwpage.keyboard.type(fioParts[1]);
            const middleNameInputEl = await pwpage.waitForSelector('[name="is[patronymic]"]', {
                state: 'attached',
            });
            await middleNameInputEl.focus();
            await pwpage.keyboard.type(fioParts[2]);

            const dobInputEl = await pwpage.waitForSelector('[name="is[date]"]', {
                state: 'attached',
            });
            await helpers.sleep(1000);
            await dobInputEl.focus();
            // await helpers.sleep(1000);
            await pwpage.keyboard.type(this.dob);
            // await helpers.sleep(1000);
            await pwpage.keyboard.press('Enter');

            const submitButtonEl = await pwpage.$('#btn-sbm');
            await submitButtonEl.click();

            for (let i = 0; i < 5; i++) {
                try {
                    const captchaAnswer = await this.getCaptchaAnswer();
                    console.log(captchaAnswer.success ? captchaAnswer.answer : 'Failed to get captcha answer');
                    if (!captchaAnswer.success) {
                        continue;
                    }
                    let captchaAnswerEl = await pwpage.$('#captcha-popup-code');
                    await (await captchaAnswerEl).focus();
                    await pwpage.keyboard.type(captchaAnswer.answer.toLocaleUpperCase());
                    await helpers.sleep(2000);
                    const captchaSubmitEl = await pwpage.$('#ncapcha-submit');
                    await captchaSubmitEl.click();
                    await helpers.sleep(1000);
                    captchaAnswerEl = await pwpage.$('#captcha-popup-code');
                    if (!!captchaAnswerEl) {
                        await this.emit('captcha-not-accepted');
                        continue;
                    }
                    // console.log(captchaAnswerEl);
                    // const results=await pwpage.$$('.results-frame')
                    // const results = await pwpage.waitForSelector('.results');
                    // console.log({ results });
                    // const captchaInput = await pwpage.waitForSelector('#capchaVisual');
                    // console.log({ captchaImage });
                    // if (captchaImage) {
                    //     await this.emit('captcha-not-accepted');
                    //     continue;
                    // }
                    await this.emit('captcha-accepted');
                    break;
                } catch (err) {
                    console.log(err);
                }
            }

            const resultHtml = await pwpage.content();

            console.log({ resultHtml });
            return {
                success: true,
                resultHtml,
            };
        }

        // await bus.emit('parser.fssp-sefizlico.parsing-failure');

        return {
            success: false,
            err: lastError,
        };
    }

    // public async run(): Promise<OperationResult<string>> {
    //
    //     this.emit('started');
    //
    //     const site = new FsspGovRuSite();
    //
    //     let lastError;
    //
    //     for (let i = 0; i < 1; i++) {
    //
    //         await this.emit('attempt', { num: i + 1 });
    //
    //         await pwpageRecreate();
    //
    //         const homePage = await site.openHomePage(5000);
    //         if (!homePage) {
    //             await this.emit('error.failed-to-open-home-page');
    //             lastError = 'Failed to open home page, site might be down';
    //             continue;
    //         }
    //         await this.emit('opened-home-page');
    //         await homePage.waitReady(5000);
    //         await homePage.closeStartModal(5000);
    //
    //         const searchForm = await homePage.getSearchForm(5000);
    //         if (!searchForm) {
    //             await this.emit('error.search-form-not-ready');
    //             lastError = 'Failed to acquire search form';
    //             continue;
    //         }
    //         await this.emit('search-form-ready');
    //         await searchForm.expandForm();
    //         await searchForm.inputFio(this.fio);
    //         await searchForm.inputDob(this.dob);
    //         await searchForm.inputRegion(this.reg);
    //         await searchForm.clickSearchButton();
    //
    //         const browser = await services.headless.getBrowser();
    //         const contexts = await browser.contexts();
    //         const pages = await contexts[0].pages();
    //         pwpageSet(pages[1]);
    //
    //         const captchaEl = await pages[1].waitForSelector('#captcha-popup-code');
    //         // console.log(captchaEl);
    //         await captchaEl.focus();
    //         await pwpage.keyboard.type('qwe');
    //     }
    //
    //     // await bus.emit('parser.fssp-sefizlico.parsing-failure');
    //
    //     return {
    //         success: false,
    //         err: lastError,
    //     };
    // }

    public extractJson(html: string) {

        return html;

        // const $ = cheerio.load(html);
        //
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

    protected async getCaptchaAnswer(): Promise<GetCaptchaAnswerResultType> {

        const captchaImage = await pwpage.waitForSelector('#capchaVisual');
        const imageBase64 = await helpers.getImageBase64(pwpage, captchaImage, 5000);

        if (!imageBase64) {
            return {
                answerRequestEntity: null,
                success: false,
                err: 'Error loading captcha image in headless page',
            };
        }

        const ansreqEnt = await services.siteCaptcha
            .createAnswerRequest(imageBase64);

        const answerPromise = new Promise<string>((resolve, reject) => {
            bus.once('captcha.answer-received', (appEvent: AppEvent<any>) => {
                // console.log({ 'appEvent.payload': appEvent.payload });
                resolve(appEvent.payload);
            });
            bus.once('captcha.rucaptcha-error', (appEvent: AppEvent<any>) => {
                reject();
            });
        });

        await services.siteCaptcha.getFromRucaptchaCom(imageBase64);

        try {
            const answer = await answerPromise;
            return {
                answerRequestEntity: ansreqEnt,
                success: true,
                answer,
            };
        } catch (err) {
            return {
                answerRequestEntity: ansreqEnt,
                success: false,
                err,
            };
        }
    }
}
