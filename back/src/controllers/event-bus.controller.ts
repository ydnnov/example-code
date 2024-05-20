import { FastifyReply, FastifyRequest } from 'fastify';
import { EventBusEmitRequestType } from '../shared/schemas/common.js';
import { services } from '../services/services.js';

export class EventBusController {

    public async emit(
        request: FastifyRequest<{ Body: EventBusEmitRequestType }>,
        reply: FastifyReply,
    ) {
        return await services.bus.emit(request.body.eventName, request.body.payload);
    }

}

export const eventBusController = new EventBusController();
