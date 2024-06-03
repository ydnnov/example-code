import EventEmitter2 from 'eventemitter2';
import { config } from '../config.js';
import { helpers } from '../helpers/helpers.js';
import { OperationResult } from '../types/common.js';
import { services } from './services.js';
import playwright from 'playwright';

export abstract class HeadlessService {

    protected events = new EventEmitter2();

    // protected browserPromise: Promise<Browser>;
    //
    // protected pagePromise: Promise<Page>;

    protected isResponseFnBound = false;

    protected responseListeners = [];

    public abstract getBrowser();

    // TODO Удалить вообще puppeteer из проекта, и эту иерархию с
    //      абстрактным классом, сделать только playwright и всё
    public abstract getPage(): Promise<playwright.Page>

    public abstract recreatePage(): Promise<playwright.Page>;

    public abstract getUrl(): Promise<string>;

    public abstract goto(url: string): Promise<OperationResult<null>>;

    public abstract reloadPage(): Promise<OperationResult<null>>;

    public abstract onClick(x: number, y: number);

    public abstract onKeypress(key: string, code: string);

    // public abstract getFreshPage();

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
