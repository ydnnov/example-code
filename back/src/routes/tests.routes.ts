import { FastifyInstance, FastifyRequest } from 'fastify';
import { bus } from '../bus.js';
import { type GenericDictionary } from '../shared/schemas/common.js';

export async function testsRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/tests/event-bus',
        async ({ body }: FastifyRequest<{
            Body: {
                eventName: string,
                payload: GenericDictionary
            }
        }>) => {
            await bus.emit(body.eventName, body.payload);
            return 'ok';
        },
    );

}
