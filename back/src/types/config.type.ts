import { PuppeteerLaunchOptions } from 'puppeteer';
import { LaunchOptions as PlaywrightLaunchOptions } from 'playwright';

export type PuppeteerBrowserParams = {
    type: 'puppeteer'
    launchOptions: PuppeteerLaunchOptions
}

export type PlaywrightBrowserParams = {
    type: 'playwright'
    launchOptions: PlaywrightLaunchOptions
    viewportSize: {
        width: number
        height: number
    }
}

export type ConfigType = {
    autoSendScreenshots: boolean
    browserParams: PuppeteerBrowserParams | PlaywrightBrowserParams
};
