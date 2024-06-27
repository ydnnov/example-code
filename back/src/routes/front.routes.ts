import { FastifyInstance } from 'fastify';
import { controllers } from '../controllers/controllers.js';

export async function frontRoutes(fastify: FastifyInstance) {
    fastify.get(
        '/front/init-data',
        controllers.front.getInitData.bind(controllers.front),
    );
}
