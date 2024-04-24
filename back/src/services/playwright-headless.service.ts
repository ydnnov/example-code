import EventEmitter2 from 'eventemitter2';
import { config } from '../config.js';
import { helpers } from '../helpers/helpers.js';
import { OperationResult } from '../types/common.js';
import { services } from './services.js';
// import playwright from 'playwright';
import {
    firefox,
    Browser as PlaywrightBrowser,
    BrowserContext as PlaywrightBrowserContext,
    Page as PlaywrightPage,
    LaunchOptions as PlaywrightLaunchOptions,
} from 'playwright';
import { HeadlessService } from './headless.service.js';

export class PlaywrightHeadlessService extends HeadlessService {

    protected events = new EventEmitter2();

    protected browserPromise: Promise<PlaywrightBrowser>;

    protected browserContextPromise: Promise<PlaywrightBrowserContext>;

    protected pagePromise: Promise<PlaywrightPage>;

    protected isResponseFnBound = false;

    protected responseListeners = [];

    constructor(playwrightLaunchOptions: PlaywrightLaunchOptions) {
        super();
        this.browserPromise = new Promise(resolve => {
            firefox.launch(playwrightLaunchOptions)
                .then(browser => {
                    resolve(browser);
                })
                .catch(err => {
                    console.log('Failed to launch puppeteer');
                    console.log(err);
                });
        });
    }

    public async getBrowser(): Promise<PlaywrightBrowser> {
        return this.browserPromise;
    }

    public async getPage(): Promise<PlaywrightPage> {
        const browser = await this.browserPromise;
        if (!this.browserContextPromise) {
            // console.log('Creating new browser context');
            this.browserContextPromise = browser.newContext();
        }
        const context = await this.browserContextPromise;
        const pages = await context.pages();
        let page;
        if (!pages.length) {
            // console.log('No pages, creating new and returning it');
            page = await context.newPage();
        } else {
            // console.log('Page exists, returning it');
            page = pages[0];
        }
        // this.bindResponseFn(page);
        return page;
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
        services.headlessScreenshots.addClickPoint(x, y);
        // console.log({ x, y });
        return {
            success: true,
            resultData: null,
        };
    }

    public async onKeypress(code: string) {
        const page = await this.getPage();
        console.log(code);
        await page.keyboard.type(code);
        // await page.keyboard.press(<KeyInput>code);
        if (code === 'Escape') {
            services.headlessScreenshots.deleteAllClickPoints();
        }
        // console.log({ code });
        return {
            success: true,
            resultData: null,
        };
    }

    // public async getFreshPage() {
    //     const browser = await this.browserPromise;
    //     const pages = await browser.pages();
    //     while(pages.length) {
    //         await pages[0].close();
    //     }
    //     const page = await browser.newPage();
    //     console.log({ page });
    //     this.bindResponseFn(page);
    //     return page;
    // }

    // public addResponseListener(callback: (response: HTTPResponse) => void) {
    //     this.events.addListener('response', callback);
    // }
    //
    // public removeResponseListener(callback: (response: HTTPResponse) => void) {
    //     this.events.removeListener('response', callback);
    // }
    //
    // public async waitForSelector(selector: string, pollDelay: number, timeout: number)
    //     : Promise<ElementHandle> {
    //     const page = await this.getPage();
    //     return helpers.pollWait<ElementHandle>(
    //         () => page.$(selector),
    //         pollDelay,
    //         timeout,
    //     );
    // }
    //
    // protected bindResponseFn(page: Page) {
    //     if (this.isResponseFnBound) {
    //         return;
    //     }
    //     page.on('response', (response: HTTPResponse) => {
    //         this.events.emit('response', response);
    //     });
    //     this.isResponseFnBound = true;
    // }
}
