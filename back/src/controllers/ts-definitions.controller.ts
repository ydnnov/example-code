import { FastifyReply, FastifyRequest } from 'fastify';
import { services } from '../services/services.js';

export class TsDefinitionsController {

    public async all(request: FastifyRequest, reply: FastifyReply) {
        return await services.tsDefinitions.all();
    }
}

export const tsDefinitionsController = new TsDefinitionsController();
