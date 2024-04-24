import { ConfigType } from './types/config.type.js';
import { PuppeteerLaunchOptions } from 'puppeteer';
import { LaunchOptions as PlaywrightLaunchOptions } from 'playwright';

const puppeteerLaunchOptions: PuppeteerLaunchOptions = {
    headless: false,
    args: ['--no-sandbox'],
    ignoreHTTPSErrors: true,
    defaultViewport: {
        width: 800,
        height: 1200,
    },
};

const playwrightLaunchOptions: PlaywrightLaunchOptions = {
    headless: false,
};

export const config: ConfigType = {
    browserParams: {
        type: 'puppeteer',
        launchOptions: puppeteerLaunchOptions,
        // type: 'playwright',
        // launchOptions: playwrightLaunchOptions,
    },
};
