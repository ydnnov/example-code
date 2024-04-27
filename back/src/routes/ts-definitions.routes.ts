import { FastifyInstance } from 'fastify';
import { tsDefinitionsController } from '../controllers/ts-definitions.controller.js';

export async function tsDefinitionsRoutes(fastify: FastifyInstance) {
    fastify.get(
        '/ts-definitions/all',
        tsDefinitionsController.all.bind(tsDefinitionsController),
    );
}
