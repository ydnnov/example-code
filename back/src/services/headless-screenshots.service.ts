import gm from 'gm';
import { websocket } from '../websocket.js';
import { logger } from '../logger.js';
import { helpers } from '../helpers/helpers.js';
import { OperationResult } from '../types/common.js';
import { pwpage } from '../pwpage.js';

export class HeadlessScreenshotsService {

    protected screenshotClickPoints = [];
    protected useClickPoints = false;  // TODO

    protected sendInterval = 1000;

    protected intervalHandle = null;

    public addClickPoint(x: number, y: number): OperationResult<null> {
        if (this.useClickPoints) {
            this.screenshotClickPoints.push({ x, y });
        }
        return { success: true, resultData: null };
    }

    public deleteAllClickPoints(): OperationResult<null> {
        if (this.useClickPoints) {
            this.screenshotClickPoints = [];
        }
        return { success: true, resultData: null };
    }

    public startSendingScreenshots(): OperationResult<null> {
        // console.log('Starting sending screenshots');
        if (!this.intervalHandle) {
            this.intervalHandle = setInterval(() => {
                this.sendScreenshot();
            }, this.sendInterval);
        }
        return { success: true, resultData: null };
    }

    public stopSendingScreenshots(): OperationResult<null> {
        // console.log('Stopping sending screenshots');
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = null;
        }
        return { success: true, resultData: null };
    }

    public setSendInterval(interval: number): OperationResult<null> {
        // console.log(`Setting screenshot send interval to ${interval}`);
        this.sendInterval = interval;
        if (this.intervalHandle) {
            this.stopSendingScreenshots();
            this.startSendingScreenshots();
        }
        return { success: true, resultData: null };
    }

    public async sendScreenshot() {
        try {
            // console.log('capturing screenshot');
            // const page = await services.headless.getPage();
            // if (!page) {
            //     console.log('Page does not exist');
            //     return;
            // }
            const screenshot = await pwpage.screenshot({
                type: 'png',
                // encoding: 'base64',
                encoding: 'binary',
            });
            // const screenshotGm = gm(screenshot);
            // // const screenshotGm = gm(1000, 800, 'rgb(255,255,255)');
            // if (this.useClickPoints) {
            //     screenshotGm.stroke('rgb(0, 150, 255)');
            //     screenshotGm.fill('rgb(0, 150, 255)');
            //     for (let i = 0; i < this.screenshotClickPoints.length; i++) {
            //         const { x, y } = this.screenshotClickPoints[i];
            //         screenshotGm.drawCircle(x - 1, y - 1, x + 2, y + 2);
            //     }
            // }
            // const imgData = <Buffer>await new Promise(resolve => {
            //     screenshotGm.toBuffer('png', (err, buf) => {
            //         if (err) {
            //             console.error(err);
            //             process.exit(-1);
            //         }
            //         resolve(buf);
            //     });
            // });
            // console.log('DONE capturing screenshot. Sending');
            // console.log(imgData.toString('base64'));
            websocket.sockets.emit('update-screenshot', screenshot.toString('base64'));
            // websocket.sockets.emit('update-screenshot', imgData.toString('base64'));
        } catch (err) {
            console.log(helpers.consoleHeader('ERROR IN CAPTURING SCREENSHOT', 100, '=', 31));
            logger.error(err);
            console.log(helpers.colorizeForConsole(31, '='.repeat(100)));
        }
    };

}
