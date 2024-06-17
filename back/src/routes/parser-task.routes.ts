import { FastifyInstance } from 'fastify';
import { controllers } from '../controllers/controllers.js';

export async function parserTaskRoutes(fastify: FastifyInstance) {
    fastify.get(
        '/parser-tasks',
        controllers.parserTask.getMany.bind(controllers.parserTask),
    );
}
