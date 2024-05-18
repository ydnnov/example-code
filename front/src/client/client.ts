import { codeExecClient } from '~/client/code-exec.client.js';
import { eventBusClient } from '~/client/event-bus.client.js';
import { headlessClient } from '~/client/headless.client.js';
import { headlessScreenshotsClient } from '~/client/headless-screenshots.client.js';
import { parserClient } from '~/client/parser.client.js';
import { tsDefinitionsClient } from '~/client/ts-definitions.client.js';

export const client = {
    codeExec: codeExecClient,
    eventBus: eventBusClient,
    headless: headlessClient,
    headlessScreenshots: headlessScreenshotsClient,
    parser: parserClient,
    tsDefinitions: tsDefinitionsClient,
};
