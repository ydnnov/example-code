import { FastifyInstance } from 'fastify';
import {
    headlessGotoBodySchema,
    headlessOnClickBodySchema,
    headlessOnKeypressBodySchema,
} from '../schemas/headless.schema.js';
import { headlessController } from '../controllers/headless.controller.js';

export async function headlessRoutes(fastify: FastifyInstance) {
    // fastify.get(
    //     '/headless/tabs',
    //     headlessController.getUrl.bind(headlessController),
    // );
    // fastify.post(
    //     '/headless/tab',
    //     { schema: { body: headlessGotoBodySchema } },
    //     headlessController.goto.bind(headlessController),
    // );
    // fastify.post(
    //     '/headless/tab/:id/goto',
    //     { schema: { body: headlessGotoBodySchema } },
    //     headlessController.goto.bind(headlessController),
    // );
    // fastify.post(
    //     '/headless/tab/:id/reset-context',
    //     { schema: { body: headlessGotoBodySchema } },
    //     headlessController.goto.bind(headlessController),
    // );
    // fastify.get(
    //     '/headless/tab/:id/get-url',
    //     headlessController.getUrl.bind(headlessController),
    // );
    // fastify.post(
    //     '/headless/tab/:id/reload-page',
    //     headlessController.reloadPage.bind(headlessController),
    // );
    // fastify.post(
    //     '/headless/tab/:id/on-click',
    //     { schema: { body: headlessOnClickBodySchema } },
    //     headlessController.onClick.bind(headlessController),
    // );
    // fastify.post(
    //     '/headless/tab/:id/on-keypress',
    //     { schema: { body: headlessOnKeypressBodySchema } },
    //     headlessController.onKeypress.bind(headlessController),
    // );


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
