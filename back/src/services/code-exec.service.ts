import _gm from 'gm';
import { env as _env } from '../envconf.js';
import { websocket as _websocket } from '../websocket.js';
import { logger } from '../logger.js';
import { bag as _bag } from '../bag.js';
import { config as _config } from '../config.js';
import { helpers as _helpers } from '../helpers/helpers.js';
import { services as _services } from './services.js';

export class CodeExecService {

    public async exec(code: string) {
        const gm = _gm;
        const env = _env;
        const helpers = _helpers;
        const websocket = _websocket;
        const bag = _bag;
        const config = _config;
        const services = _services;
        const browser = await services.headless.getBrowser();
        const page = await services.headless.getPage();
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
