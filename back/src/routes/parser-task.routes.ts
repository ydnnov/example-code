import { FastifyInstance } from 'fastify';
import { controllers } from '../controllers/controllers.js';
import { parserTaskGetManyQuerySchema } from '../shared/schemas/parser-task/read.js';
import { parserTaskCreateOneBodySchema } from '../shared/schemas/parser-task/create.js';

export async function parserTaskRoutes(fastify: FastifyInstance) {
    fastify.get(
        '/parser-tasks',
        { schema: { querystring: parserTaskGetManyQuerySchema } },
        controllers.parserTask.getMany.bind(controllers.parserTask),
    );
    fastify.post(
        '/parser-task',
        { schema: { body: parserTaskCreateOneBodySchema } },
        controllers.parserTask.createOne.bind(controllers.parserTask),
    );
}
