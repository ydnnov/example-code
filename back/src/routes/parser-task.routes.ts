import { FastifyInstance } from 'fastify';
import { controllers } from '../controllers/controllers.js';
import { parserTaskGetManyQuerySchema } from '../shared/schemas/parser-task/read.js';

export async function parserTaskRoutes(fastify: FastifyInstance) {
    fastify.get(
        '/parser-tasks',
        { schema: { querystring: parserTaskGetManyQuerySchema } },
        controllers.parserTask.getMany.bind(controllers.parserTask),
    );
}
