import { FastifyReply, FastifyRequest } from 'fastify';
import { services } from '../services/services.js';
import {
    ParserTaskGetManyQueryType,
    ParserTaskGetManyResultType,
} from '../shared/schemas/parser-task/read.js';
import { ParserTaskCreateOneBodyType } from '../shared/schemas/parser-task/create.js';

export class ParserTaskController {
    public async getMany(
        request: FastifyRequest<{ Querystring: ParserTaskGetManyQueryType }>,
        reply: FastifyReply,
    ): Promise<ParserTaskGetManyResultType> {
        return services.parserTask.getMany(request.query);
    }

    public async createOne(
        request: FastifyRequest<{ Body: ParserTaskCreateOneBodyType }>,
        reply: FastifyReply,
    ) {
        return await services.parserTask.createOne(request.body);
    }
}
