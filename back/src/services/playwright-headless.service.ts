import EventEmitter2 from 'eventemitter2';
import { OperationResult } from '../types/common.js';
import { services } from './services.js';
import {
    firefox,
    Browser as PlaywrightBrowser,
    BrowserContext as PlaywrightBrowserContext,
    Page as PlaywrightPage,
    LaunchOptions as PlaywrightLaunchOptions,
} from 'playwright';
import { HeadlessService } from './headless.service.js';
import { bus } from '../bus.js';

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
                    console.log('Failed to launch playwright');
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
            page.on('domcontentloaded', (page: PlaywrightPage) => {
                console.log('domcontentloaded: ' + page.url());
            });
        } else {
            // console.log('Page exists, returning it');
            page = pages[0];
        }
        // this.bindResponseFn(page);
        return page;
    }

    public async getUrl(): Promise<string> {
        const page = await this.getPage();
        return page.url();
    }

    public async goto(url: string): Promise<OperationResult<null>> {
        const page = await this.getPage();
        await bus.emitAsync('bk.headless.navigation-started', { url });
        // console.log(`Navigating to ${url}`);
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

    public async onKeypress(key: string, code: string) {
        // console.log({ key, code });
        const page = await this.getPage();
        if (key.length === 1) {
            await page.keyboard.type(key);
        } else {
            await page.keyboard.press(key);
        }
        // if (code === 'Escape') {
        //     services.headlessScreenshots.deleteAllClickPoints();
        // }
        return {
            success: true,
            resultData: null,
        };
    }
}
