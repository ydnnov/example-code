import { FastifyInstance } from 'fastify';
import {
    headlessGotoBodySchema,
    headlessOnClickBodySchema,
    headlessOnKeypressBodySchema,
} from '../schemas/headless.schema.js';
import { headlessController } from '../controllers/headless.controller.js';

export async function headlessRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/headless/goto',
        { schema: { body: headlessGotoBodySchema } },
        headlessController.goto.bind(headlessController),
    );
    fastify.get(
        '/headless/get-url',
        headlessController.getUrl.bind(headlessController),
    );
    fastify.post(
        '/headless/reload-page',
        headlessController.reloadPage.bind(headlessController),
    );
    fastify.post(
        '/headless/on-click',
        { schema: { body: headlessOnClickBodySchema } },
        headlessController.onClick.bind(headlessController),
    );
    fastify.post(
        '/headless/on-keypress',
        { schema: { body: headlessOnKeypressBodySchema } },
        headlessController.onKeypress.bind(headlessController),
    );
}
