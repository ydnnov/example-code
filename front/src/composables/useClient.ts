import { Axios } from 'axios';
import { CodeExecClient } from '~/client/code-exec.client.js';
import { EventBusClient } from '~/client/event-bus.client.js';
import { HeadlessClient } from '~/client/headless.client.js';
import { HeadlessScreenshotsClient } from '~/client/headless-screenshots.client.js';
import { ParserClient } from '~/client/parser.client.js';
import { TsDefinitionsClient } from '~/client/ts-definitions.client.js';

export default function useClient() {

    const { $request } = useNuxtApp() as { $request: Axios };

    return {
        codeExec: new CodeExecClient($request),
        eventBus: new EventBusClient($request),
        headless: new HeadlessClient($request),
        headlessScreenshots: new HeadlessScreenshotsClient($request),
        parser: new ParserClient($request),
        tsDefinitions: new TsDefinitionsClient($request),
    };
}
