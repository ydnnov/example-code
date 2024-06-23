import * as _fs from 'fs';
import _gm from 'gm';
import * as _playwright from 'playwright';
import { transform } from '@swc/core';
import { env as _env } from '../envconf.js';
import { websocket as _websocket } from '../websocket.js';
import { logger } from '../logger.js';
import { bag as _bag } from '../bag.js';
import { config as _config } from '../config.js';
import { helpers as _helpers } from '../helpers/helpers.js';
import { services as _services } from './services.js';

export class CodeExecService {

    public async exec(tsCode: string) {
        const fs = _fs;
        const gm = _gm;
        const playwright = _playwright;
        const env = _env;
        const helpers = _helpers;
        const websocket = _websocket;
        const bag = _bag;
        const config = _config;
        const services = _services;
        const browser = await services.headless.getBrowser();
        const page = await services.headless.getPage();
        tsCode = this.stripImports(tsCode);
        tsCode = this.stripDeclares(tsCode);
        const { code } = await transform(tsCode, {
            jsc: {
                parser: {
                    syntax: 'typescript',
                },
            },
        });
        try {
            eval(`(async () => {
                try {
                    ${code};
                } catch (err) {
                    console.log(helpers.colorizeForConsole(31,
                        helpers.consoleHeader('RUNTIME ERROR', '!'),
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

    protected stripImports(code: string): string {
        code = code.replace(/(\/\/)?\s*import .+;[\n\r]*/g, '');
        return code;
    }

    protected stripDeclares(code: string): string {
        code = code.replace(/(\/\/)?\s*declare .+;[\n\r]*/g, '');
        return code;
    }
}
