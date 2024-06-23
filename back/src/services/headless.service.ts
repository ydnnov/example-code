import { OperationResult } from '../types/common.js';
import { services } from './services.js';
import {
    chromium,
    firefox,
    Browser,
    BrowserContext,
    Page,
    LaunchOptions,
    BrowserContextOptions,
} from 'playwright';
import { config } from '../config.js';
import { EmitsToBus } from '../classes/emits-to-bus.js';

export class HeadlessService extends EmitsToBus {

    protected eventPrefix: string = 'headless-service';

    protected browserPromise: Promise<Browser>;
    protected browserContextPromise: Promise<BrowserContext>;
    protected pagePromise: Promise<Page>;
    protected isResponseFnBound = false;
    protected responseListeners = [];

    protected contexts: {
        [id: number]: {
            id: number
            contextObj: BrowserContext
        }
    } = {};
    protected lastContextId = 0;

    constructor(launchOptions: LaunchOptions) {
        super();
        this.browserPromise = new Promise(resolve => {
            firefox.launch(launchOptions)
                .then(browser => {
                    resolve(browser);
                })
                .catch(err => {
                    console.log('Failed to launch playwright');
                    console.log(err);
                });
        });
    }

    public async createContext(opts: BrowserContextOptions) {
        const browser = await this.browserPromise;
        const contextObj = await browser.newContext(opts);
        this.lastContextId++;
        this.contexts[this.lastContextId] = {
            id: this.lastContextId,
            contextObj,
        };
        return this.contexts[this.lastContextId];
    }

    public async getBrowser(): Promise<Browser> {
        return this.browserPromise;
    }

    public async getPage(): Promise<Page> {
        const browser = await this.browserPromise;
        if (!this.browserContextPromise) {
            // console.log('Creating new browser context');
            this.browserContextPromise = browser.newContext();
        }
        const context = await this.browserContextPromise;

        // Debug
        if (false) {
            await context.route('http://32.sar.msudrf.ru/captcha.php', (route, request) => {
                if (true) {
                    route.abort('failed');
                } else {
                    console.log('slowing down captcha image request');
                    setTimeout(() => {
                        console.log(request.url());
                        console.log('continuing with request');
                        route.continue();
                    }, 5000);
                }
            });
        }

        const pages = await context.pages();
        let page;
        if (!pages.length) {
            // console.log('No pages, creating new and returning it');
            page = await context.newPage();
            page.on('domcontentloaded', (page: Page) => {
                console.log('domcontentloaded: ' + page.url());
            });
        } else {
            // console.log('Page exists, returning it');
            page = pages[0];
        }
        page.setViewportSize(config.browserParams.viewportSize);
        return page;
    }

    public async recreatePage(): Promise<Page> {
        const browser = await this.browserPromise;
        const contexts = browser.contexts();
        if (contexts.length > 1) {
            console.log('Number of contexts is greater than 1');
        }
        if (contexts[0]) {
            contexts[0].close();
        }
        this.browserContextPromise = browser.newContext();
        const context = await this.browserContextPromise;
        const page = await context.newPage();
        await page.setViewportSize(config.browserParams.viewportSize);
        return page;
    }

    public async getUrl(): Promise<string> {
        const page = await this.getPage();
        return page.url();
    }

    public async goto(url: string): Promise<OperationResult<null>> {
        const page = await this.getPage();
        await this.emit('navigation-started', { url });
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
