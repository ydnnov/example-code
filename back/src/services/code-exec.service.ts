import _gm from 'gm';
import { env as _env } from '../envconf.js';
import { websocket as _websocket } from '../websocket.js';
import { logger } from '../logger.js';
import { bag as _bag } from '../bag.js';
import { config as _config } from '../config.js';
import { helpers as _helpers } from '../helpers/helpers.js';
import { headlessService as _headlessService } from './headless.service.js';
import { headlessScreenshotsService as _headlessScreenshotsService } from './headless-screenshots.service.js';

class CodeExecService {

    public async exec(code: string) {
        const gm = _gm;
        const env = _env;
        const helpers = _helpers;
        const websocket = _websocket;
        const bag = _bag;
        const config = _config;
        const headlessService = _headlessService;
        const headlessScreenshotsService = _headlessScreenshotsService;
        const browser = await headlessService.getBrowser();
        const page = await headlessService.getPage();
        try {
            eval(`(async () => {
                try {
                    ${code};
                } catch (err) {
                    console.log(helpers.colorizeForConsole(31,
                        helpers.consoleHeaderText('RUNTIME ERROR', '!'),
                    ));
                    console.error(err);
                    console.log(helpers.colorizeForConsole(31, '!'.repeat(100)));
                }
            })();`);
        } catch (err) {
            console.log(helpers.colorizeForConsole(31,
                '!! ERROR IN CODE ' + '!'.repeat(83),
            ));
            logger.error(err);
            console.log(helpers.colorizeForConsole(31, '!'.repeat(100)));
        }
    }
}

export const codeExecService = new CodeExecService();
