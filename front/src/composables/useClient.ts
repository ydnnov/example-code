import { Axios } from 'axios';
import { CodeExecClient } from '~/client/code-exec.client.js';
import { EventBusClient } from '~/client/event-bus.client.js';
import { FrontClient } from '~/client/front.client.js';
import { HeadlessClient } from '~/client/headless.client.js';
import { HeadlessScreenshotsClient } from '~/client/headless-screenshots.client.js';
import { ParserClient } from '~/client/parser.client.js';
import { ParserTaskClient } from '~/client/parser-task.client.js';
import { TsDefinitionsClient } from '~/client/ts-definitions.client.js';

export default function useClient() {

    const { $request } = useNuxtApp() as { $request: Axios };

    return {
        $request,
        codeExec: new CodeExecClient($request),
        eventBus: new EventBusClient($request),
        front: new FrontClient($request),
        headless: new HeadlessClient($request),
        headlessScreenshots: new HeadlessScreenshotsClient($request),
        parser: new ParserClient($request),
        parserTask: new ParserTaskClient($request),
        tsDefinitions: new TsDefinitionsClient($request),
    };
}
