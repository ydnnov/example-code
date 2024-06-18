import { db } from '../data-source.js';
import { ParserEntity, ParserTaskEntity } from '../entities/entities.js';
import { ParserNameType } from '../shared/schemas/parser-task/common.js';
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

        const parserRepo = mgr.getRepository(ParserEntity);
        const parserTaskRepo = mgr.getRepository(ParserTaskEntity);

        const parserEnts = await parserRepo.find();
        const parserNamesById: {
            [key: number]: ParserNameType
        } = {};
        for (let i = 0; i < parserEnts.length; i++) {
            parserNamesById[parserEnts[i].id] = <ParserNameType>parserEnts[i].name;
        }

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
                parser_name: parserNamesById[pt.parser_id],
            });
        }

        const total = await parserTaskRepo.count();

        return { items, total };
    }

    public async createOne(
        body: ParserTaskCreateOneBodyType,
    ): Promise<ParserTaskType> {

        const mgr = db.createEntityManager();

        const parserRepo = mgr.getRepository(ParserEntity);
        const parserTaskRepo = mgr.getRepository(ParserTaskEntity);

        const parserEnt = await parserRepo.findOneBy({ name: body.parserName });

        let ptaskEnt = new ParserTaskEntity();
        ptaskEnt.parser_id = parserEnt.id;
        ptaskEnt.input_data = body.inputData;
        ptaskEnt = await parserTaskRepo.save(ptaskEnt);
        ptaskEnt = await parserTaskRepo.findOneBy({ id: ptaskEnt.id });

        const result = {
            ...ptaskEnt,
            parser_name: body.parserName,
        };

        return result;
    }
}
