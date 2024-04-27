import EventEmitter2 from 'eventemitter2';
import { db } from '../data-source.js';
import { ParserEntity } from '../entities/parser.entity.js';
import { ParseUnitEntity } from '../entities/parse-unit.entity.js';
import { ParserStartBodyType } from '../schemas/parser.schema.js';

export class ParserService {

    public events = new EventEmitter2();

    public async startParser(
        { parserName, inputData: { searchText } }: ParserStartBodyType,
    ): Promise<ParseUnitEntity> {

        const mgr = db.createEntityManager();

        const parserEnt = await mgr.findOneBy(ParserEntity, { name: parserName });

        let unitEnt = new ParseUnitEntity();
        unitEnt.parser_id = parserEnt.id;
        unitEnt.input_data = {
            searchText,
        };

        const result = await mgr.insert(ParseUnitEntity, unitEnt);
        const id = result.identifiers[0].id;

        unitEnt = await mgr.findOneBy(ParseUnitEntity, { id });

        const runResult = await parserEnt.run(unitEnt);

        return unitEnt;
    }

}
