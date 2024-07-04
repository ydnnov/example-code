import { Page } from 'playwright';
import { ElementHandle } from 'playwright';
import { RaceResult, StdResult } from '../types/common.js';
import { bus } from '../bus.js';

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

    pollWait: async <T>(callback, delay, timeout): Promise<StdResult<T>> => {
        return new Promise<StdResult<T>>(async (resolve) => {
            const timeStart = Date.now();
            for (; ;) {
                try {
                    const resultValue = await callback();
                    if (resultValue) {
                        resolve({
                            success: true,
                            ...resultValue,
                        });
                        return;
                    }
                } catch (err) {
                    resolve({
                        success: false,
                        err,
                    });
                    return;
                }
                const timeElapsed = Date.now() - timeStart;
                if (timeElapsed > timeout) {
                    resolve({
                        success: false,
                        err: `${timeout}ms timeout elapsed`,
                    });
                    return;
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

    raceTimeout: async <TData = {}, TErr = any>(
        from: string,
        timeout: number,
    ): Promise<RaceResult<TData, TErr>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: false,
                    err: 'timeout',
                    from,
                });
            }, timeout);
        });
    },

    async waitEvent(events: string[]) {
        const handler = (...args) => {
            console.log(args);
        };
        const result = new Promise((resolve) => {
            bus.once('parsing-step', handler);
        });
        return result;
    },

    colorizeForConsole: (colorNum, message) => {
        // TODO запили чтобы цвета были не цифрой какой то непонятной,
        //      а чтобы писать 'red' / 'green' / 'blue', и через
        //      литерал-типы была подсказка
        return `\x1b[${colorNum}m${message}\x1b[0m`;
    },

    consoleHeader: (
        message: string,
        width: number,
        separatorChar = '=',
        colorNum = 0,
    ) => {
        const realWidth = (width / separatorChar.length);
        return `\x1b[${colorNum}m${separatorChar.repeat(2)} ${message} ` +
            `${separatorChar.repeat(realWidth - (message.length + 4))}\x1b[0m`;
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
        img: ElementHandle,
        timeout: number,
    ): Promise<string | null> {
        const result = await page.evaluate(
            async ({ img, timeout }: {
                img: HTMLImageElement,
                timeout: number,
            }) => {
                const imgLoadPromise = new Promise((resolve, reject) => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', reject);
                    }
                });
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(reject, timeout);
                });
                try {
                    await Promise.race([imgLoadPromise, timeoutPromise]);
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    const base64Data = canvas.toDataURL('image/png');
                    return base64Data;
                } catch (err) {
                    return null;
                }
            }, { img, timeout });
        return result;
    },
};

export { helpers };
