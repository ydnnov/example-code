import { config } from '../config.js';
import { CodeExecService } from './code-exec.service.js';
import { EventBusService } from './event-bus.service.js';
import { FrontService } from './front.service.js';
import { HeadlessService } from './headless.service.js';
import { HeadlessScreenshotsService } from './headless-screenshots.service.js';
import { ParserService } from './parser.service.js';
import { ParserTaskService } from './parser-task.service.js';
// import { ParserTaskAttemptService } from './parser-task-attempt.service.js';
// import { ParsingLoopService } from './parsing-loop.service.js';
import { SiteCaptchaService } from './site-captcha.service.js';
import { TsDefinitionsService } from './ts-definitions.service.js';

export const services = {
    bus: new EventBusService(),
    codeExec: new CodeExecService(),
    front: new FrontService(),
    headless: new HeadlessService(config.browserParams.launchOptions),
    headlessScreenshots: new HeadlessScreenshotsService(),
    parser: new ParserService(),
    parserTask: new ParserTaskService(),
    // parserTaskAttempt: new ParserTaskAttemptService(),
    // parsingLoop: new ParsingLoopService(),
    siteCaptcha: new SiteCaptchaService(),
    tsDefinitions: new TsDefinitionsService(),
};
