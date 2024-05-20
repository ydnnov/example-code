import { FastifyInstance } from 'fastify';
import { eventBusController } from '../controllers/event-bus.controller.js';
import { eventBusEmitRequestSchema } from '../shared/schemas/common.js';

export async function eventBusRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/event-bus/emit',
        { schema: { body: eventBusEmitRequestSchema } },
        eventBusController.emit.bind(eventBusController),
    );
}
