import * as fs from 'node:fs';
import { env } from '../envconf.js';
import { db } from '../data-source.js';
import { ParserTaskEntity } from '../entities/parser-task.entity.js';
import { ParserStartBodyType } from '../schemas/parser.schema.js';
import { ParserBase } from '../parsers/parser-base.js';
import { FsspSefizlicoParser } from '../parsers/fssp-sefizlico/fssp-sefizlico.parser.js';
import { MsudrfTerrPodsParser } from '../parsers/msudrf-terr-pods/msudrf-terr-pods.parser.js';
import { MsudrfSudDeloParser } from '../parsers/msudrf-sud-delo/msudrf-sud-delo.parser.js';
import { PARSER_INDEX_BY_KEY } from '../shared/constants/parsing.js';

export class ParserService {

    public async startParser(
        params: ParserStartBodyType,
    ): Promise<object> {

        const mgr = db.createEntityManager();

        const parserTaskRepo = mgr.getRepository(ParserTaskEntity);

        let ptaskEnt = new ParserTaskEntity();
        ptaskEnt.parser_index = PARSER_INDEX_BY_KEY[params.parserName];
        ptaskEnt.input_data = params.inputData;
        await parserTaskRepo.save(ptaskEnt);

        const parser = this.createParser(params);

        const result = await parser.run();

        if (result.success === true) {

            const filename = `${env.STORAGE_PATH}/result_html/${
                params.parserName}/${ptaskEnt.id}.html`;

            fs.writeFileSync(filename, result.resultHtml);

            const resultJson = parser.extractJson(result.resultHtml);

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
            case 'fssp/search-ext-fizicheskoe-lico': {
                return new FsspSefizlicoParser(
                    params.inputData.fio,
                    params.inputData.dob,
                    params.inputData.reg,
                );
            }
            default: {
                throw new Error(`Unknown parsing request: ${JSON.stringify(params)}`);
            }
        }
    }
}
