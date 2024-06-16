import { config } from '../config.js';
import { CodeExecService } from './code-exec.service.js';
import { EventBusService } from './event-bus.service.js';
import { HeadlessService } from './headless.service.js';
import { HeadlessScreenshotsService } from './headless-screenshots.service.js';
import { ParserService } from './parser.service.js';
import { SiteCaptchaService } from './site-captcha.service.js';
import { TsDefinitionsService } from './ts-definitions.service.js';

export const services = {
    bus: new EventBusService(),
    codeExec: new CodeExecService(),
    headless: new HeadlessService(config.browserParams.launchOptions),
    headlessScreenshots: new HeadlessScreenshotsService(),
    parser: new ParserService(),
    siteCaptcha: new SiteCaptchaService(),
    tsDefinitions: new TsDefinitionsService(),
};
