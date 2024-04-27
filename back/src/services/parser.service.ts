import { db } from '../data-source.js';
import EventEmitter2 from 'eventemitter2';
import { ParserEntity } from '../entities/parser.entity.js';
import { ParseUnitEntity } from '../entities/parse-unit.entity.js';
import { ParserNameType } from '../schemas/parser.schema.js';

export class ParserService {

    public events = new EventEmitter2();

    public async startParser(parserName: ParserNameType): Promise<ParseUnitEntity> {

        const mgr = db.createEntityManager();

        const parserEnt = await mgr.findOneBy(ParserEntity, { name: parserName });

        console.log({ parserEnt });

        return new ParseUnitEntity();
    }

}
