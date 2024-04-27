import { FastifyReply, type FastifyRequest } from 'fastify';
import { HeadlessScreenshotsSetIntervalBodyType } from '../schemas/headless-screenshots.schema.js';
import { services } from '../services/services.js';

export class HeadlessScreenshotsController {

    public async startSending() {
        return await services.headlessScreenshots.startSendingScreenshots();
    }

    public async stopSending() {
        return await services.headlessScreenshots.stopSendingScreenshots();
    }

    public async setSendInterval(
        request: FastifyRequest<{ Body: HeadlessScreenshotsSetIntervalBodyType }>,
        reply: FastifyReply,
    ) {
        return await services.headlessScreenshots.setSendInterval(request.body.interval);
    }
}

export const headlessScreenshotsController = new HeadlessScreenshotsController();
