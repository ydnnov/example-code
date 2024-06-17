import { FastifyReply, FastifyRequest } from 'fastify';
import { services } from '../services/services.js';
import {
    ParserTaskGetManyParamsType,
    ParserTaskGetManyResultType,
} from '../shared/schemas/parser-task/read.js';

export class ParserTaskController {
    public async getMany(
        request: FastifyRequest<{ Params: ParserTaskGetManyParamsType }>,
        reply: FastifyReply,
    ): Promise<ParserTaskGetManyResultType> {
        return services.parserTask.getMany(request.params);
    }
}
