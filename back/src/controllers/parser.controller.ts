import { FastifyReply, FastifyRequest } from 'fastify';
import { services } from '../services/services.js';
import { ParserStartBodyType } from '../schemas/parser.schema.js';
import { ParseUnitEntity } from '../entities/parse-unit.entity.js';

export class ParserController {
    public async start(
        request: FastifyRequest<{ Body: ParserStartBodyType }>,
        reply: FastifyReply,
    ): Promise<ParseUnitEntity> {
        // TODO: Надо возвращать код 201
        // TODO: настроить чтобы fastify автоматом это делал
        return services.parser.startParser(request.body);
    }

}
