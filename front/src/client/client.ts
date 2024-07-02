// import { eventBusClient } from 'src/client/event-bus.client.js';
//
// export default {
//   eventBus: eventBusClient,
// };

import { Axios } from 'axios';
import { CodeExecClient } from './code-exec.client.js';
import { EventBusClient } from './event-bus.client.js';
import { FrontClient } from './front.client.js';
import { HeadlessClient } from './headless.client.js';
import { HeadlessScreenshotsClient } from './headless-screenshots.client.js';
import { ParserClient } from './parser.client.js';
import { ParserTaskClient } from './parser-task.client.js';
import { TsDefinitionsClient } from './ts-definitions.client.js';
import { api } from 'boot/axios.js';

export const client= {
    api,
    codeExec: new CodeExecClient(api),
    eventBus: new EventBusClient(api),
    front: new FrontClient(api),
    headless: new HeadlessClient(api),
    headlessScreenshots: new HeadlessScreenshotsClient(api),
    parser: new ParserClient(api),
    parserTask: new ParserTaskClient(api),
    tsDefinitions: new TsDefinitionsClient(api),
}
