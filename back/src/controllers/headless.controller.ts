import { FastifyReply, type FastifyRequest } from 'fastify';
import {
    HeadlessGotoBodyType,
    HeadlessOnClickBodyType,
    HeadlessOnKeypressBodyType,
} from '../schemas/headless.schema.js';
import { headlessService } from '../services/headless.service.js';
import { OperationResult } from '../types/common.js';

class HeadlessController {

    public async goto(
        request: FastifyRequest<{ Body: HeadlessGotoBodyType }>,
        reply: FastifyReply,
    ): Promise<OperationResult<null>> {
        return await headlessService.goto(request.body.url);
    }

    public async reloadPage(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<OperationResult<null>> {
        return await headlessService.reloadPage();
    }

    public async onClick(
        request: FastifyRequest<{ Body: HeadlessOnClickBodyType }>,
        reply: FastifyReply,
    ) {
        return await headlessService.onClick(request.body.x, request.body.y);
    }

    public async onKeypress(
        request: FastifyRequest<{ Body: HeadlessOnKeypressBodyType }>,
        reply: FastifyReply,
    ) {
        return await headlessService.onKeypress(request.body.code);
    }
}

export const headlessController = new HeadlessController();
