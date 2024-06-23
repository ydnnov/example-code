import fs from 'node:fs';
import { env } from '../envconf.js';
import { db } from '../data-source.js';
import { PARSER_INDEX_BY_KEY, PARSER_KEY, PARSER_KEY_BY_INDEX } from '../shared/constants/parsing.js';
import { ParserFactory } from '../factories/parser.factory.js';
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

        let immediateResult = null;
        if (body.timeout) {
            immediateResult = await this.runTask(ptaskEnt.id);
        }

        ptaskEnt = await parserTaskRepo.findOneBy({ id: ptaskEnt.id });

        const result = {
            ...ptaskEnt,
            parser_key: body.parserKey,
        };

        if (immediateResult) {
            result.result_data = immediateResult;
        }

        return result;
    }

    public async runTask(taskId: number): Promise<object> {

        const mgr = db.createEntityManager();

        const taskRepo = mgr.getRepository(ParserTaskEntity);

        const taskEnt = await taskRepo.findOneBy({ id: taskId });

        const parserFactory = new ParserFactory();
        const parser = parserFactory.create(taskEnt);
        // const parser = this.createParser(taskEnt);
        const result = await parser.run();

        if (result.success === true) {

            const parserKey = PARSER_KEY_BY_INDEX[taskEnt.parser_index];
            const filename = `${env.STORAGE_PATH}/result_html/${parserKey}/${taskId}.html`;

            fs.writeFileSync(filename, result.resultHtml);

            const resultJson = parser.extractJson(result.resultHtml);

            console.log('resultJson');
            console.log(resultJson);
            console.log('='.repeat(50));
            console.log('resultJson');

            taskEnt.status = 'success';
            taskEnt.result_data = resultJson;
            await taskRepo.save(taskEnt);

            return resultJson;

        } else {

            taskEnt.status = 'failed';
            taskEnt.result_data = { error: result.err };
            await taskRepo.save(taskEnt);

            return { error: result.err };
        }
    }
}
