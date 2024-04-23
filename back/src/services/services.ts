import { CodeExecService } from './code-exec.service.js';
import { HeadlessService } from './headless.service.js';
import { HeadlessScreenshotsService } from './headless-screenshots.service.js';

export const services = {
    codeExec: new CodeExecService(),
    headless: new HeadlessService(),
    headlessScreenshots: new HeadlessScreenshotsService(),
};
