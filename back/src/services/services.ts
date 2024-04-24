import { CodeExecService } from './code-exec.service.js';
import { HeadlessScreenshotsService } from './headless-screenshots.service.js';
import { HeadlessServiceFactory } from '../factories/headless-service.factory.js';
import { config } from '../config.js';

const headlessServiceFactory = new HeadlessServiceFactory();

export const services = {
    codeExec: new CodeExecService(),
    headless: headlessServiceFactory.create(config.browserParams),
    headlessScreenshots: new HeadlessScreenshotsService(),
};
