import { Page } from 'playwright';
import { ElementHandle } from 'playwright';

const helpers = {
    fmtDateTime: (d: Date): string => {
        const lz = num => ('0' + num).slice(-2);
        const year = d.getFullYear();
        const month = lz(d.getMonth() + 1);
        const day = lz(d.getDate());
        const hour = lz(d.getHours());
        const minute = lz(d.getMinutes());
        const second = lz(d.getSeconds());
        return `${year}-${month}-${day}-${hour}-${minute}-${second}`;
    },

    pollWait: async <T>(callback, delay, timeout): Promise<T> => {
        let resultValue = null;
        return new Promise(async (resolve, reject) => {
            const timeStart = Date.now();
            for (; ;) {
                try {
                    resultValue = await callback();
                } catch (err) {
                    resultValue = null;
                }
                if (resultValue) {
                    resolve(resultValue);
                    return;
                }
                const timeElapsed = Date.now() - timeStart;
                if (timeElapsed > timeout) {
                    console.trace();
                    reject(`${timeout}ms timeout elapsed`);
                    break;
                }
                await helpers.sleep(delay);
            }
        });
    },

    sleep: async (ms, log = false) => {
        if (log) {
            console.log(`${ms}ms sleeping...`);
        }
        return new Promise(res => {
            setTimeout(res, ms);
        });
    },

    colorizeForConsole: (colorNum, message) => {
        return `\x1b[${colorNum}m${message}\x1b[0m`;
    },

    consoleHeaderText: (message, separatorChar = '=') => {
        return `== ${message} ${'='.repeat(100 - (message.length + 4))}`;
    },

    consoleHeader: (message, separatorChar = '=', colorNum = 0) => {
        return `\x1b[${colorNum}m${separatorChar.repeat(2)} ${message} ` +
            `${separatorChar.repeat(100 - (message.length + 4))}\x1b[0m`;
    },

    chunkify<T>(arr: T[], chunkSize: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    },

    async getImageBase64(
        page: Page,
        element: ElementHandle,
    ): Promise<string> {
        const result = await page.evaluate((elem) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = elem.width;
            canvas.height = elem.height;
            context.drawImage(elem, 0, 0);
            const base64Data = canvas.toDataURL('image/png');
            return base64Data;
        }, element);
        return result;
    },
};

export { helpers };
