import { FastifyReply, type FastifyRequest } from 'fastify';
import {
    HeadlessGotoBodyType,
    HeadlessOnClickBodyType,
    HeadlessOnKeypressBodyType,
} from '../schemas/headless.schema.js';
import { services } from '../services/services.js';
import { OperationResult } from '../types/common.js';

class HeadlessController {

    public async goto(
        request: FastifyRequest<{ Body: HeadlessGotoBodyType }>,
        reply: FastifyReply,
    ): Promise<OperationResult<null>> {
        return await services.headless.goto(request.body.url);
    }

    public async reloadPage(
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<OperationResult<null>> {
        return await services.headless.reloadPage();
    }

    public async onClick(
        request: FastifyRequest<{ Body: HeadlessOnClickBodyType }>,
        reply: FastifyReply,
    ) {
        return await services.headless.onClick(request.body.x, request.body.y);
    }

    public async onKeypress(
        request: FastifyRequest<{ Body: HeadlessOnKeypressBodyType }>,
        reply: FastifyReply,
    ) {
        return await services.headless.onKeypress(request.body.key, request.body.code);
    }
}

export const headlessController = new HeadlessController();
