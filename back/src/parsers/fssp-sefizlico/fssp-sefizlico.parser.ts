import * as cheerio from 'cheerio';
import { bus } from '../../bus.js';
import { services } from '../../services/services.js';
import { StdResult } from '../../types/common.js';
import { AppEvent } from '../../shared/classes/app-event.js';
import { ParserBase } from '../parser-base.js';
import { pwpage } from '../../pwpage.js';
import { CaptchaAnswerRequestEntity } from '../../entities/captcha-answer-request.entity.js';
import { helpers } from '../../helpers/helpers.js';
import { FsspSefizlicoAttemptHandler } from './fssp-sefizlico.attempt-handler.js';
import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { db } from '../../data-source.js';

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

    public async run(): Promise<StdResult<{ resultHtml: string[] }>> {

        this.emit('started');

        const mgr = db.createEntityManager();

        const taskAttemptRepo = mgr.getRepository(ParserTaskAttemptEntity);

        const resultHtml = [];

        // let lastError;
        let stop = false;
        // let paused = true;
        let i = 0;
        bus.on('parsing.stop', () => {
            stop = true;
        });
        while(!stop) {
            // try {
            await this.emit('attempt', { num: i + 1 });
            // let attemptEnt = new ParserTaskAttemptEntity();
            // attemptEnt.parser_task_id = this.parserTask.id;
            // await taskAttemptRepo.save(attemptEnt);
            // attemptEnt = await taskAttemptRepo.findOneBy({ id: attemptEnt.id });
            let attemptEnt = await taskAttemptRepo.findOneBy({ id: 2 });
            const attemptHandler = new FsspSefizlicoAttemptHandler(this, attemptEnt, pwpage);
            const attemptResult = await attemptHandler.perform();
            console.log({ attemptResult });
            console.log('waiting...');
            await new Promise((resolve) => {
                const handler = (event: string, ...args) => {
                    if (event === 'parsing-resume') {
                        bus.emitter.offAny(handler);
                        resolve();
                    } else if (event === 'parsing-stop') {
                        bus.emitter.offAny(handler);
                        stop = true;
                        resolve();
                    }
                };
                bus.onAny(handler);
            });
            console.log('...passed wait');

            // break;
            // process.exit(0);
            // console.log({result});
            // if (result) {
            //     return {
            //         success: true,
            //         resultHtml: [String(result)],
            //     };
            // }
            //
            //
            // // if (!result) {
            // //     throw new Error('Failed parsing attempt');
            // // }
            // // const attempt=new FsspSefizlicoAttemptHandler()
            //
            // // await pwpageRecreate();
            // //
            // // const site = new FsspGovRuSite(pwpage);
            // //
            // // await site.issIpPage.open(100);
            // // // site.issIpPage.searchForm.inputFields()
            // //
            // // console.log({ issIpPage: site.issIpPage });
            //
            // // issIpPage.
            //
            // // } catch (err) {
            // //     console.log(err);
            //
            // // if (!issIpPage) {
            // //     await bus.emit('error.failed-to-open-iss-ip-page');
            // //     lastError = 'Failed to open iss ip page, site might be down';
            // //     continue;
            // // }
            // // }
            // i++;
        }

        // const regionInputEl = await pwpage.waitForSelector('#region_id_chosen input', {
        //     state: 'attached',
        // });
        // await regionInputEl.focus();
        // await pwpage.keyboard.type(this.reg);
        // await pwpage.keyboard.press('Enter');
        //
        // const fioParts = this.fio.trim().split(' ');
        // if (fioParts.length !== 3) {
        //     throw new Error(`Invalid fio: "${this.fio}"`);
        // }
        // const lastNameInputEl = await pwpage.waitForSelector('[name="is[last_name]"]', {
        //     state: 'attached',
        // });
        // await lastNameInputEl.focus();
        // await pwpage.keyboard.type(fioParts[0]);
        // const firstNameInputEl = await pwpage.waitForSelector('[name="is[first_name]"]', {
        //     state: 'attached',
        // });
        // await firstNameInputEl.focus();
        // await pwpage.keyboard.type(fioParts[1]);
        // const middleNameInputEl = await pwpage.waitForSelector('[name="is[patronymic]"]', {
        //     state: 'attached',
        // });
        // await middleNameInputEl.focus();
        // await pwpage.keyboard.type(fioParts[2]);
        //
        // const dobInputEl = await pwpage.waitForSelector('[name="is[date]"]', {
        //     state: 'attached',
        // });
        // await helpers.sleep(1000);
        // await dobInputEl.focus();
        // // await helpers.sleep(1000);
        // await pwpage.keyboard.type(this.dob);
        // // await helpers.sleep(1000);
        // await pwpage.keyboard.press('Enter');
        //
        // await this.emit('submitting-form');
        // const submitButtonEl = await pwpage.$('#btn-sbm');
        // await submitButtonEl.click();
        //
        // let resultsEl = null;
        // for (let i = 0; i < 3; i++) {
        //     try {
        //         const captchaAnswer = await this.getCaptchaAnswer();
        //         console.log(captchaAnswer.success ? captchaAnswer.answer : 'Failed to get captcha answer');
        //         if (!captchaAnswer.success) {
        //             continue;
        //         }
        //         const captchaAnswerEl = await pwpage.$('#captcha-popup-code');
        //         await (await captchaAnswerEl).focus();
        //         await pwpage.keyboard.type(captchaAnswer.answer.toLocaleUpperCase());
        //         await helpers.sleep(2000);
        //         const captchaSubmitEl = await pwpage.$('#ncapcha-submit');
        //         await captchaSubmitEl.click();
        //         // await helpers.sleep(1000);
        //         await this.emit('waiting-if-captcha-is-accepted');
        //         resultsEl = await pwpage.waitForSelector(
        //             '.results',
        //             { timeout: 30000 },
        //         );
        //         if (!resultsEl) {
        //             await this.emit('captcha-not-accepted');
        //             continue;
        //         }
        //         await this.emit('captcha-accepted');
        //         break;
        //     } catch (err) {
        //         console.log(err);
        //     }
        // }
        // if (!resultsEl) {
        //     await this.emit('failed-all-captcha-attempts');
        //     continue;
        // }
        //
        // resultHtml.push(await pwpage.content());
        //
        // console.log({ resultHtml });
        // return {
        //     success: true,
        //     resultHtml,
        // };
        //
        // await bus.emit('parser.fssp-sefizlico.parsing-failure');

        return {
            success: false,
            err: 'lastError',
        };
    }

    // public async run(): Promise<StdResult<{ resultHtml: string[] }>> {
    //
    //     this.emit('started');
    //
    //     const site = new FsspGovRuSite();
    //
    //     const resultHtml = [];
    //
    //     let lastError;
    //
    //     for (let i = 0; i < 1; i++) {
    //
    //         await this.emit('attempt', { num: i + 1 });
    //
    //         await pwpageRecreate();
    //
    //         // await pwpage.goto('https://google.com');
    //         await site.openIssIpPage(5000);
    //         const issIpPage = await site.openIssIpPage(5000);
    //         if (!issIpPage) {
    //             await bus.emit('error.failed-to-open-iss-ip-page');
    //             lastError = 'Failed to open iss ip page, site might be down';
    //             continue;
    //         }
    //         await bus.emit('opened-iss-ip-page');
    //
    //         // const regionInputEl = await pwpage.waitForSelector('#region_id_chosen input', {
    //         //     state: 'attached',
    //         // });
    //         // await regionInputEl.focus();
    //         // await pwpage.keyboard.type(this.reg);
    //         // await pwpage.keyboard.press('Enter');
    //         //
    //         // const fioParts = this.fio.trim().split(' ');
    //         // if (fioParts.length !== 3) {
    //         //     throw new Error(`Invalid fio: "${this.fio}"`);
    //         // }
    //         // const lastNameInputEl = await pwpage.waitForSelector('[name="is[last_name]"]', {
    //         //     state: 'attached',
    //         // });
    //         // await lastNameInputEl.focus();
    //         // await pwpage.keyboard.type(fioParts[0]);
    //         // const firstNameInputEl = await pwpage.waitForSelector('[name="is[first_name]"]', {
    //         //     state: 'attached',
    //         // });
    //         // await firstNameInputEl.focus();
    //         // await pwpage.keyboard.type(fioParts[1]);
    //         // const middleNameInputEl = await pwpage.waitForSelector('[name="is[patronymic]"]', {
    //         //     state: 'attached',
    //         // });
    //         // await middleNameInputEl.focus();
    //         // await pwpage.keyboard.type(fioParts[2]);
    //         //
    //         // const dobInputEl = await pwpage.waitForSelector('[name="is[date]"]', {
    //         //     state: 'attached',
    //         // });
    //         // await helpers.sleep(1000);
    //         // await dobInputEl.focus();
    //         // // await helpers.sleep(1000);
    //         // await pwpage.keyboard.type(this.dob);
    //         // // await helpers.sleep(1000);
    //         // await pwpage.keyboard.press('Enter');
    //         //
    //         // await this.emit('submitting-form');
    //         // const submitButtonEl = await pwpage.$('#btn-sbm');
    //         // await submitButtonEl.click();
    //         //
    //         // let resultsEl = null;
    //         // for (let i = 0; i < 3; i++) {
    //         //     try {
    //         //         const captchaAnswer = await this.getCaptchaAnswer();
    //         //         console.log(captchaAnswer.success ? captchaAnswer.answer : 'Failed to get captcha answer');
    //         //         if (!captchaAnswer.success) {
    //         //             continue;
    //         //         }
    //         //         const captchaAnswerEl = await pwpage.$('#captcha-popup-code');
    //         //         await (await captchaAnswerEl).focus();
    //         //         await pwpage.keyboard.type(captchaAnswer.answer.toLocaleUpperCase());
    //         //         await helpers.sleep(2000);
    //         //         const captchaSubmitEl = await pwpage.$('#ncapcha-submit');
    //         //         await captchaSubmitEl.click();
    //         //         // await helpers.sleep(1000);
    //         //         await this.emit('waiting-if-captcha-is-accepted');
    //         //         resultsEl = await pwpage.waitForSelector(
    //         //             '.results',
    //         //             { timeout: 30000 },
    //         //         );
    //         //         if (!resultsEl) {
    //         //             await this.emit('captcha-not-accepted');
    //         //             continue;
    //         //         }
    //         //         await this.emit('captcha-accepted');
    //         //         break;
    //         //     } catch (err) {
    //         //         console.log(err);
    //         //     }
    //         // }
    //         // if (!resultsEl) {
    //         //     await this.emit('failed-all-captcha-attempts');
    //         //     continue;
    //         // }
    //         //
    //         // resultHtml.push(await pwpage.content());
    //         //
    //         // console.log({ resultHtml });
    //         // return {
    //         //     success: true,
    //         //     resultHtml,
    //         // };
    //     }
    //
    //     // await bus.emit('parser.fssp-sefizlico.parsing-failure');
    //
    //     return {
    //         success: false,
    //         err: lastError,
    //     };
    // }
    //
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

        const $ = cheerio.load(html);

        const trElems = $('.results-frame table tr');
        const resultItems = [];
        for (let i = 1; i < trElems.length; i++) {
            const tdElems = $(trElems[i]).children('td');
            const resultItem = {
                dolzhnik: $(tdElems[0]).text(),
                ispol_proizv: $(tdElems[1]).text(),
                rekvizity_ispol_dok: $(tdElems[2]).text(),
                data_prichina_okonch_ip: $(tdElems[3]).text(),
                servis: $(tdElems[4]).text(),
                predmet_ispol_summa_zadolzh: $(tdElems[5]).text(),
                otdel_sud_prist: $(tdElems[6]).text(),
                sud_pristav: $(tdElems[7]).text(),
            };
            resultItems.push(resultItem);
        }

        return resultItems;
    }

    protected async getCaptchaAnswer(): Promise<GetCaptchaAnswerResultType> {

        await this.emit('waiting-for-captcha-image');
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
