import _gm from 'gm';
import { env as _env } from '../envconf.js';
import { websocket as _websocket } from '../websocket.js';
import { logger } from '../logger.js';
import { bag as _bag } from '../bag.js';
import { config as _config } from '../config.js';
import { helpers as _helpers } from '../helpers/helpers.js';
import { services as _services } from './services.js';
import { parsers as _parsers } from '../parsers/parsers.js';
import * as _playwright from 'playwright';
import { transform, Options } from '@swc/core';

export class CodeExecService {

    public async exec(tsCode: string) {
        const gm = _gm;
        const env = _env;
        const helpers = _helpers;
        const websocket = _websocket;
        const bag = _bag;
        const config = _config;
        const services = _services;
        const parsers = _parsers;
        const playwright = _playwright;
        const browser = await services.headless.getBrowser();
        const page = await services.headless.getPage();
        // console.log(page);
        // console.log(code);
        tsCode = this.stripImports(tsCode);
        tsCode = this.stripDeclares(tsCode);
        // console.log('='.repeat(50));
        // console.log(code);
        const { code } = await transform(tsCode, {
            jsc: {
                parser: {
                    syntax: 'typescript',
                },
            },
        });
        // console.log(code);
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

    protected stripImports(code: string): string {
        code = code.replace(/import .+;\n/g, '');
        return code;
    }

    protected stripDeclares(code: string): string {
        code = code.replace(/declare .+;\n/g, '');
        return code;
    }
}
