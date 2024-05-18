import { FastifyReply, FastifyRequest } from 'fastify';
import { CodeExecRequestType } from '../schemas/code-exec.schema.js';
import { services } from '../services/services.js';

export class EventBusController {

    public async emit(
        request: FastifyRequest<{ Body: CodeExecRequestType }>,
        reply: FastifyReply,
    ) {
        return await services.bus.exec(request.body);
    }

}

export const eventBusController = new EventBusController();
