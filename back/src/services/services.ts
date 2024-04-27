import { config } from '../config.js';
import { CodeExecService } from './code-exec.service.js';
import { HeadlessServiceFactory } from '../factories/headless-service.factory.js';
import { HeadlessScreenshotsService } from './headless-screenshots.service.js';
import { ParserService } from './parser.service.js';
import { SiteCaptchaService } from './site-captcha.service.js';
import { TsDefinitionsService } from './ts-definitions.service.js';

const headlessServiceFactory = new HeadlessServiceFactory();

export const services = {
    codeExec: new CodeExecService(),
    headless: headlessServiceFactory.create(config.browserParams),
    headlessScreenshots: new HeadlessScreenshotsService(),
    parser: new ParserService(),
    siteCaptcha: new SiteCaptchaService(),
    tsDefinitions: new TsDefinitionsService(),
};
