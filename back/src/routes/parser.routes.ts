import { FastifyInstance } from 'fastify';
import { parserStartBodySchema } from '../schemas/parser.schema.js';
import { controllers } from '../controllers/controllers.js';

export async function parserRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/parser/start',
        { schema: { body: parserStartBodySchema } },
        controllers.parser.start.bind(controllers.parser),
    );
}
