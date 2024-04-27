import { CodeExecController } from './code-exec.controller.js';
import { HeadlessController } from './headless.controller.js';
import { HeadlessScreenshotsController } from './headless-screenshots.controller.js';
import { ParserController } from './parser.controller.js';
import { SiteCaptchaController } from './site-captcha.controller.js';
import { TsDefinitionsController } from './ts-definitions.controller.js';

export const controllers = {
    codeExec: new CodeExecController(),
    headless: new HeadlessController(),
    headlessScreenshots: new HeadlessScreenshotsController(),
    parser: new ParserController(),
    siteCaptcha: new SiteCaptchaController(),
    tsDefinitions: new TsDefinitionsController(),
};
