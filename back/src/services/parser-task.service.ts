import { db } from '../data-source.js';
import { ParserEntity } from '../entities/parser.entity.js';
import {
    ParserTaskGetManyParamsType,
    ParserTaskGetManyResultType
} from '../shared/schemas/parser-task/read.js';

export class ParserTaskService {

    public async getMany(
        params: ParserTaskGetManyParamsType,
    ): Promise<ParserTaskGetManyResultType> {

        const mgr = db.createEntityManager();

        const parserRepo = mgr.getRepository(ParserEntity);

        console.log(await parserRepo.find());

        return {
            numFound: 0,
            items: [],
        };
    }

    // public async createOne(
    //     params: ParserTaskCreateOneBodyType,
    // ): Promise<object> {
    //
    //     const mgr = db.createEntityManager();
    //
    //     const parserRepo = mgr.getRepository(ParserEntity);
    //
    //     console.log(await parserRepo.find());
    //
    //     // const parserTaskRepo = mgr.getRepository(ParserTaskEntity);
    //     //
    //     // const parserEnt = await parserRepo.findOneBy({ name: params.parserName });
    //
    // }
}
