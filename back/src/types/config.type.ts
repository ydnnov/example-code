import { LaunchOptions } from 'playwright';


export type ConfigType = {
    autoSendScreenshots: boolean
    browserParams: {
        launchOptions: LaunchOptions
        viewportSize: {
            width: number
            height: number
        }
    }
};
