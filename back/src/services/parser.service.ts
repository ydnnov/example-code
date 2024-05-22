import { db } from '../data-source.js';
import { ParserEntity } from '../entities/parser.entity.js';
import { ParserTaskEntity } from '../entities/parser-task.entity.js';
import { ParserStartBodyType } from '../schemas/parser.schema.js';
import { parsers } from '../parsers/parsers.js';
import * as fs from 'node:fs';
import { env } from '../envconf.js';

export class ParserService {

    public async startParser(
        { parserName, inputData }: ParserStartBodyType,
    ): Promise<object> {

        const mgr = db.createEntityManager();

        const parserRepo = mgr.getRepository(ParserEntity);
        const parserTaskRepo = mgr.getRepository(ParserTaskEntity);

        const parserEnt = await parserRepo.findOneBy({ name: parserName });

        let ptaskEnt = new ParserTaskEntity();
        ptaskEnt.parser_id = parserEnt.id;
        ptaskEnt.input_data = inputData;
        /*const result = */
        await parserTaskRepo.save(ptaskEnt);
        // console.log({ result });

        let result;
        switch (parserName) {
            case 'msudrf/sud-delo':
                result = await parsers.msudrfSudDelo.run(inputData.searchText);
                if (result.success === true) {
                    const filename = `${env.STORAGE_PATH}/result_html/${ptaskEnt.id}.html`;
                    fs.writeFileSync(filename, result.resultData);
                    ptaskEnt.status = 'success';
                    ptaskEnt.result_data = { html: result.resultData };
                    // console.log({ result });
                    await parserTaskRepo.save(ptaskEnt);
                    const resultJson = parsers.msudrfSudDelo.extractJson(ptaskEnt.id);
                    return resultJson;
                } else {
                    ptaskEnt.status = 'failed';
                    ptaskEnt.result_data = { error: result.err };
                    await parserTaskRepo.save(ptaskEnt);
                    return { error: result.err };
                }
            case 'msudrf/territorialnaya-podsudnost':
                result = await parsers.territorialnayaPodsudnost.run(inputData.searchText);
                return result;
                // if (result.success === true) {
                //     const filename = `${env.STORAGE_PATH}/result_html/${ptaskEnt.id}.html`;
                //     fs.writeFileSync(filename, result.resultData);
                //     ptaskEnt.status = 'success';
                //     ptaskEnt.result_data = { html: result.resultData };
                //     // console.log({ result });
                //     await parserTaskRepo.save(ptaskEnt);
                //     const resultJson = parsers.msudrfSudDelo.extractJson(ptaskEnt.id);
                //     return resultJson;
                // } else {
                //     ptaskEnt.status = 'failed';
                //     ptaskEnt.result_data = { error: result.err };
                //     await parserTaskRepo.save(ptaskEnt);
                //     return { error: result.err };
                // }
            default:
                throw new Error(`Unknown parser ${parserName}`);
        }

        // console.log({ ptaskEnt });
        //
        // const result = await mgr.insert(ParserTaskEntity, ptaskEnt);
        // const id = result.identifiers[0].id;

        // ptaskEnt = await mgr.findOneBy(ParserTaskEntity, { id });
        //
        // const runResult = await parserEnt.run(ptaskEnt);
        //
        // return ptaskEnt;
    }
}
