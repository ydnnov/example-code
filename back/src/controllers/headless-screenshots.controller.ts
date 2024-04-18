import { FastifyReply, type FastifyRequest } from 'fastify';
import { HeadlessScreenshotsSetIntervalBodyType } from '../schemas/headless-screenshots.schema.js';
import { headlessScreenshotsService } from '../services/headless-screenshots.service.js';

class HeadlessScreenshotsController {

    public async startSending() {
        return await headlessScreenshotsService.startSendingScreenshots();
    }

    public async stopSending() {
        return await headlessScreenshotsService.stopSendingScreenshots();
    }

    public async setSendInterval(
        request: FastifyRequest<{ Body: HeadlessScreenshotsSetIntervalBodyType }>,
        reply: FastifyReply,
    ) {
        return await headlessScreenshotsService.setSendInterval(request.body.interval);
    }
}

export const headlessScreenshotsController = new HeadlessScreenshotsController();
