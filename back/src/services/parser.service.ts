import { db } from '../data-source.js';
import { ParserEntity } from '../entities/parser.entity.js';
import { ParserTaskEntity } from '../entities/parser-task.entity.js';
import { ParserStartBodyType } from '../schemas/parser.schema.js';
import * as fs from 'node:fs';
import { env } from '../envconf.js';
import { MsudrfTerrPodsParser } from '../parsers/msudrf-terr-pods/msudrf-terr-pods.parser.js';
import { MsudrfSudDeloParser } from '../parsers/msudrf-sud-delo/msudrf-sud-delo.parser.js';
import { ParserBase } from '../parsers/parser-base.js';

export class ParserService {

    public async startParser(
        params: ParserStartBodyType,
    ): Promise<object> {

        const mgr = db.createEntityManager();

        const parserRepo = mgr.getRepository(ParserEntity);
        const parserTaskRepo = mgr.getRepository(ParserTaskEntity);

        const parserEnt = await parserRepo.findOneBy({ name: params.parserName });

        let ptaskEnt = new ParserTaskEntity();
        ptaskEnt.parser_id = parserEnt.id;
        ptaskEnt.input_data = params.inputData;
        await parserTaskRepo.save(ptaskEnt);
        // console.log({ result });

        const parser = this.createParser(params);

        const result = await parser.run();

        if (result.success === true) {

            const filename = `${env.STORAGE_PATH}/result_html/${
                params.parserName}/${ptaskEnt.id}.html`;

            fs.writeFileSync(filename, result.resultData);

            const resultJson = parser.extractJson(result.resultData);

            ptaskEnt.status = 'success';
            ptaskEnt.result_data = resultJson;
            await parserTaskRepo.save(ptaskEnt);

            return resultJson;

        } else {

            ptaskEnt.status = 'failed';
            ptaskEnt.result_data = { error: result.err };
            await parserTaskRepo.save(ptaskEnt);

            return { error: result.err };
        }
    }

    protected createParser(params: ParserStartBodyType): ParserBase {
        switch (params.parserName) {
            case 'msudrf/sudebnoye-deloproizvodstvo': {
                return new MsudrfSudDeloParser(params.inputData.fio);
            }
            case 'msudrf/territorialnaya-podsudnost': {
                return new MsudrfTerrPodsParser(params.inputData.address);
            }
            default: {
                throw new Error(`Unknown parsing request: ${JSON.stringify(params)}`);
            }
        }
    }
}
