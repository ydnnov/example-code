import { EmitsToBus } from '../classes/emits-to-bus.js';
import { db } from '../data-source.js';
import { ParserTaskEntity } from '../entities/parser-task.entity.js';
import { ParserKeyType } from '../shared/schemas/parser-task/common.js';
import { ParserTaskType } from '../shared/schemas/parser-task/read.js';
import { PARSER_KEY_BY_INDEX } from '../shared/constants/parsing.js';
import { In } from 'typeorm';

export class ParsingLoopService extends EmitsToBus {
    public async run() {

        const mgr = db.createEntityManager();

        const parserTaskRepo = mgr.getRepository(ParserTaskEntity);

        const parserTaskEnts = await parserTaskRepo
            .find({
                where: {
                    status: In(['new', 'failed']),
                },
                order: {
                    id: 'asc',
                },
                take: 1,
            });


        console.log(parserTaskEnts);

        // const items: ParserTaskType[] = [];
        // for (let i = 0; i < parserTaskEnts.length; i++) {
        //     const pt = parserTaskEnts[i];
        //     items.push({
        //         ...pt,
        //         parser_key: PARSER_KEY_BY_INDEX[pt.parser_index],
        //         // parser_name: parserNamesById[pt.parser_id],
        //     });
        // }
        //
        // console.log(items);

    }
}
