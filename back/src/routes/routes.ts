import { FastifyInstance } from 'fastify';
import { codeExecRoutes } from './code-exec.routes.js';
import { eventBusRoutes } from './event-bus.routes.js';
import { headlessRoutes } from './headless.routes.js';
import { headlessScreenshotsRoutes } from './headless-screenshots.routes.js';
import { parserRoutes } from './parser.routes.js';
import { parserTaskRoutes } from './parser-task.routes.js';
import { siteCaptchaRoutes } from './site-captcha.routes.js';
import { tsDefinitionsRoutes } from './ts-definitions.routes.js';
import { testsRoutes } from './tests.routes.js';

export function routes(fastify: FastifyInstance, options, done) {
    codeExecRoutes(fastify);
    eventBusRoutes(fastify);
    headlessRoutes(fastify);
    headlessScreenshotsRoutes(fastify);
    parserRoutes(fastify);
    parserTaskRoutes(fastify);
    siteCaptchaRoutes(fastify);
    tsDefinitionsRoutes(fastify);
    testsRoutes(fastify);
    done();
}
