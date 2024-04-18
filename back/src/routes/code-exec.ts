import { FastifyInstance } from 'fastify';
import { codeExecRequestSchema } from '../schemas/code-exec.schema.js';
import { codeExecController } from '../controllers/code-exec.controller.js';

export async function codeExecRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/code-exec',
        { schema: { body: codeExecRequestSchema } },
        codeExecController.exec.bind(codeExecController),
    );
}
