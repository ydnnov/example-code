import * as cheerio from 'cheerio';
import { bus } from '../../bus.js';
import { services } from '../../services/services.js';
import { OperationResult } from '../../types/common.js';
import { AppEvent } from '../../shared/classes/app-event.js';
import { MsudrfSite } from '../../sites/msudrf-ru/msudrf.site.js';
import { SudDeloCaptchaPage } from '../../sites/msudrf-ru/sud-delo-captcha.page.js';
import { ParserBase } from '../parser-base.js';
import { pwpageRecreate } from '../../pwpage.js';
import { CaptchaAnswerRequestEntity } from '../../entities/captcha-answer-request.entity.js';

type GetCaptchaAnswerResultType = {
    answerRequestEntity: CaptchaAnswerRequestEntity,
    success: true
    answer: string
} | {
    answerRequestEntity: CaptchaAnswerRequestEntity | null,
    success: false
    err: any
}

export class MsudrfSudDeloParser extends ParserBase {

    constructor(protected fio: string) {
        super();
    }

    public async run(): Promise<OperationResult<string>> {

        const site = new MsudrfSite();

        let lastError;

        for (let i = 0; i < 10; i++) {

            await bus.emit('parser.attempt-number', { num: i + 1 });

            await pwpageRecreate();

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
            if (captchaAnswer.success === true) {
                await services.siteCaptcha.setUnconfirmedAnswer(
                    captchaAnswer.answerRequestEntity.id,
                    captchaAnswer.answer,
                );
            } else {
                lastError = captchaAnswer.err;
                continue;
            }
            await bus.emit('captcha.waiting-answer-confirmation');
            await sudDeloPage.inputCaptchaAnswer(captchaAnswer.answer);

            const zaprosyOpfrPage = await sudDeloPage.submitCaptcha(5000);
            if (!zaprosyOpfrPage) {
                await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-sud-delo-page');
                lastError = 'Failed to solve captcha';
                continue;
            }
            await services.siteCaptcha.confirmAnswer(captchaAnswer.answerRequestEntity.id);

            const searchPage = await zaprosyOpfrPage.clickGrazhdAdminDelaLink(5000);
            if (!searchPage) {
                await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-search-page');
                lastError = 'Failed to open search page';
                continue;
            }

            await searchPage.inputFio(this.fio);
            const resultPage = await searchPage.submitSearch(5000);
            if (!resultPage) {
                await bus.emit('parser.msudrf-sud-delo.error.failed-to-open-result-page');
                lastError = 'Failed to open result page';
                continue;
            }

            await bus.emit('parser.msudrf-sud-delo.parsing-success');

            return {
                success: true,
                resultData: await resultPage.getResultHtml(),
            };
        }

        await bus.emit('parser.msudrf-sud-delo.parsing-failure');

        return {
            success: false,
            err: lastError,
        };
    }

    public extractJson(html: string) {

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

    protected async getCaptchaAnswer(
        captchaPage: SudDeloCaptchaPage,
    ): Promise<GetCaptchaAnswerResultType> {

        const imageBase64 = await captchaPage.getCaptchaBase64(5000);
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
