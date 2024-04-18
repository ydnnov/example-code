import { FastifyReply, FastifyRequest } from 'fastify';
import { CodeExecRequestType } from '../schemas/code-exec.schema.js';
import { codeExecService } from '../services/code-exec.service.js';

class CodeExecController {

    public async exec(
        request: FastifyRequest<{ Body: CodeExecRequestType }>,
        reply: FastifyReply,
    ) {
        return await codeExecService.exec(request.body);
    }

}

export const codeExecController = new CodeExecController();
