import { FastifyInstance } from 'fastify';
import { codeExecRoutes } from './code-exec.routes.js';
import { eventBusRoutes } from './event-bus.routes.js';
import { frontRoutes } from './front.routes.js';
import { headlessRoutes } from './headless.routes.js';
import { headlessScreenshotsRoutes } from './headless-screenshots.routes.js';
import { parserRoutes } from './parser.routes.js';
import { parserTaskRoutes } from './parser-task.routes.js';
import { siteCaptchaRoutes } from './site-captcha.routes.js';
import { tsDefinitionsRoutes } from './ts-definitions.routes.js';
import { testsRoutes } from './tests.routes.js';
import { parsing } from '../helpers/parsing.js';
import { bus } from '../bus.js';

// import nodemon from 'nodemon';

export function routes(fastify: FastifyInstance, options, done) {
    codeExecRoutes(fastify);
    eventBusRoutes(fastify);
    frontRoutes(fastify);
    headlessRoutes(fastify);
    headlessScreenshotsRoutes(fastify);
    parserRoutes(fastify);
    parserTaskRoutes(fastify);
    siteCaptchaRoutes(fastify);
    tsDefinitionsRoutes(fastify);
    testsRoutes(fastify);
    // fastify.post('/restart', async (request, reply) => {
    //     reply.send();
    //     console.log('restarting');
    //     var nodemon = (await import('nodemon')).default({
    //         script: 'dist/src/index.js',
    //         runOnChangeOnly: false,
    //         delay: 1000,
    //     });
    //     nodemon.emit('restart');
    //     // process.exit(0);
    //     // process.abort();
    // });
    // fastify.post('/pause', async (request, reply) => {
    //     reply.send();
    //     parsing.pause();
    // });
    // fastify.post('/play', async (request, reply) => {
    //     reply.send();
    //     parsing.play();
    // });
    // fastify.post('/step', async (request, reply) => {
    //     reply.send();
    //     bus.emit('parsing-step');
    // });
    done();
}
