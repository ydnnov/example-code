import { FastifyInstance } from 'fastify';
import { headlessRoutes } from './headless.js';
import { headlessScreenshotsRoutes } from './headless-screenshots.js';
import { codeExecRoutes } from './code-exec.js';

export function routes(fastify: FastifyInstance, options, done) {
    headlessRoutes(fastify);
    headlessScreenshotsRoutes(fastify);
    codeExecRoutes(fastify);
    done();
}
