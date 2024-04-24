import { PuppeteerLaunchOptions } from 'puppeteer';
import { LaunchOptions as PlaywrightLaunchOptions } from 'playwright';

export type PuppeteerBrowserParams = {
    type: 'puppeteer'
    launchOptions: PuppeteerLaunchOptions
}

export type PlaywrightBrowserParams = {
    type: 'playwright'
    launchOptions: PlaywrightLaunchOptions
}

export type ConfigType = {
    browserParams: PuppeteerBrowserParams | PlaywrightBrowserParams
};
