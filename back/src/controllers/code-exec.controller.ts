import { FastifyReply, FastifyRequest } from 'fastify';
import { CodeExecRequestType } from '../schemas/code-exec.schema.js';
import { services } from '../services/services.js';

class CodeExecController {

    public async exec(
        request: FastifyRequest<{ Body: CodeExecRequestType }>,
        reply: FastifyReply,
    ) {
        return await services.codeExec.exec(request.body);
    }

}

export const codeExecController = new CodeExecController();
