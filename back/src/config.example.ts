import { ConfigType } from './types/config.type.js';
import { LaunchOptions as PlaywrightLaunchOptions } from 'playwright';

const playwrightLaunchOptions: PlaywrightLaunchOptions = {
    headless: true,
};

export const config: ConfigType = {
    autoSendScreenshots: true,
    browserParams: {
        launchOptions: playwrightLaunchOptions,
        viewportSize: {
            width: 800,
            height: 800,
        },
    },
};
