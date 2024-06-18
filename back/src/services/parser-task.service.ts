import { db } from '../data-source.js';
import { PARSER_INDEX_BY_KEY, PARSER_KEY_BY_INDEX } from '../shared/constants/parsing.js';
import { ParserTaskEntity } from '../entities/entities.js';
import {
    ParserTaskGetManyQueryType,
    ParserTaskGetManyResultType,
    ParserTaskType,
} from '../shared/schemas/parser-task/read.js';
import { ParserTaskCreateOneBodyType } from '../shared/schemas/parser-task/create.js';

export class ParserTaskService {

    public async getMany(
        query: ParserTaskGetManyQueryType,
    ): Promise<ParserTaskGetManyResultType> {

        const mgr = db.createEntityManager();

        const parserTaskRepo = mgr.getRepository(ParserTaskEntity);

        // TODO костыль, надо заставить typebox+fastify самим это делать
        const limit = typeof query.limit === 'number' ? query.limit : 20;
        const offset = typeof query.offset === 'number' ? query.offset : 0;

        const parserTaskEnts = await parserTaskRepo
            .find({
                order: {
                    id: 'asc',
                },
                take: limit,
                skip: offset,
            });

        const items: ParserTaskType[] = [];
        for (let i = 0; i < parserTaskEnts.length; i++) {
            const pt = parserTaskEnts[i];
            items.push({
                ...pt,
                parser_key: PARSER_KEY_BY_INDEX[pt.parser_index],
            });
        }

        const total = await parserTaskRepo.count();

        return { items, total };
    }

    public async createOne(
        body: ParserTaskCreateOneBodyType,
    ): Promise<ParserTaskType> {

        const mgr = db.createEntityManager();

        const parserTaskRepo = mgr.getRepository(ParserTaskEntity);

        let ptaskEnt = new ParserTaskEntity();
        ptaskEnt.parser_index = PARSER_INDEX_BY_KEY[body.parserKey];
        ptaskEnt.input_data = body.inputData;
        ptaskEnt = await parserTaskRepo.save(ptaskEnt);
        ptaskEnt = await parserTaskRepo.findOneBy({ id: ptaskEnt.id });

        const result = {
            ...ptaskEnt,
            parser_key: body.parserKey,
        };

        return result;
    }
}
