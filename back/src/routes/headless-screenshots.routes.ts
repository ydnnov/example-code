import { FastifyInstance } from 'fastify';
import { headlessScreenshotsController } from '../controllers/headless-screenshots.controller.js';
import { headlessScreenshotsSetIntervalBodySchema } from '../schemas/headless-screenshots.schema.js';

export async function headlessScreenshotsRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/headless-screenshots/start-sending',
        headlessScreenshotsController.startSending.bind(headlessScreenshotsController),
    );
    fastify.post(
        '/headless-screenshots/stop-sending',
        headlessScreenshotsController.stopSending.bind(headlessScreenshotsController),
    );
    fastify.post(
        '/headless-screenshots/set-send-interval',
        { schema: { body: headlessScreenshotsSetIntervalBodySchema } },
        headlessScreenshotsController.setSendInterval.bind(headlessScreenshotsController),
    );
}
