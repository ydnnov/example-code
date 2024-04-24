import { PlaywrightBrowserParams, PuppeteerBrowserParams } from '../types/config.type.js';
import { PuppeteerHeadlessService } from '../services/puppeteer-headless.service.js';
import { HeadlessService } from '../services/headless.service.js';
import { PlaywrightHeadlessService } from '../services/playwright-headless.service.js';

export class HeadlessServiceFactory {
    create(browserParams: PuppeteerBrowserParams | PlaywrightBrowserParams): HeadlessService {
        if (browserParams.type === 'puppeteer') {
            return new PuppeteerHeadlessService(browserParams.launchOptions);
        } else if (browserParams.type === 'playwright') {
            return new PlaywrightHeadlessService(browserParams.launchOptions);
        } else {
            throw new Error(`Invalid browserParams: ${JSON.stringify(browserParams)}`);
        }
    }
}
