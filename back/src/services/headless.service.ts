import EventEmitter2 from 'eventemitter2';
import puppeteer, { Browser, ElementHandle, HTTPResponse, KeyInput, Page } from 'puppeteer';
import { config } from '../config.js';
import { helpers } from '../helpers/helpers.js';
import { OperationResult } from '../types/common.js';
import { headlessScreenshotsService } from './headless-screenshots.service.js';

class HeadlessService {

    protected events = new EventEmitter2();

    protected browserPromise: Promise<Browser>;

    protected pagePromise: Promise<Page>;

    protected isResponseFnBound = false;

    protected responseListeners = [];

    constructor() {
        this.browserPromise = new Promise(resolve => {
            puppeteer.launch({
                // headless: false,
                args: ['--no-sandbox'],
                ignoreHTTPSErrors: true,
                defaultViewport: config.viewportParams,
            })
                .then(browser => {
                    resolve(browser);
                })
                .catch(err => {
                    console.log('Failed to launch puppeteer');
                    console.log(err);
                });
        });
    }

    public async getBrowser() {
        return this.browserPromise;
    }

    public async getPage() {
        const browser = await this.browserPromise;
        const pages = await browser.pages();
        let page
        if (!pages.length) {
            console.log('No pages');
            page = await this.getFreshPage();
        } else {
            page = pages[0];
        }
        this.bindResponseFn(page);
        return page;
    }

    public async getFreshPage() {
        const browser = await this.browserPromise;
        const pages = await browser.pages();
        while(pages.length) {
            await pages[0].close();
        }
        const page = await browser.newPage();
        console.log({page});
        this.bindResponseFn(page);
        return page;
    }

    public addResponseListener(callback: (response: HTTPResponse) => void) {
        this.events.addListener('response', callback);
    }

    public removeResponseListener(callback: (response: HTTPResponse) => void) {
        this.events.removeListener('response', callback);
    }

    public async waitForSelector(selector: string, pollDelay: number, timeout: number)
        : Promise<ElementHandle> {
        const page = await this.getPage();
        return helpers.pollWait<ElementHandle>(
            () => page.$(selector),
            pollDelay,
            timeout,
        );
    }

    public async goto(url: string): Promise<OperationResult<null>> {
        const page = await this.getPage();
        console.log(`Navigating to ${url}`);
        await page.goto(url);
        return {
            success: true,
            resultData: null,
        };
    }

    public async reloadPage(): Promise<OperationResult<null>> {
        const page = await this.getPage();
        await page.reload();
        return {
            success: true,
            resultData: null,
        };
    }

    public async onClick(x: number, y: number) {
        const page = await this.getPage();
        await page.mouse.click(x, y);
        headlessScreenshotsService.addClickPoint(x, y);
        // console.log({ x, y });
        return {
            success: true,
            resultData: null,
        };
    }

    public async onKeypress(code: string) {
        const page = await this.getPage();
        await page.keyboard.press(<KeyInput>code);
        if (code === 'Escape') {
            headlessScreenshotsService.deleteAllClickPoints();
        }
        // console.log({ code });
        return {
            success: true,
            resultData: null,
        };
    }

    protected bindResponseFn(page: Page) {
        if (this.isResponseFnBound) {
            return;
        }
        page.on('response', (response: HTTPResponse) => {
            this.events.emit('response', response);
        });
        this.isResponseFnBound = true;
    }
}

export const headlessService = new HeadlessService();
