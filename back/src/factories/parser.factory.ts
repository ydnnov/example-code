import { ParserBase } from '../parsers/parser-base.js';
import { MsudrfSudDeloParser } from '../parsers/msudrf-sud-delo/msudrf-sud-delo.parser.js';
import { MsudrfTerrPodsParser } from '../parsers/msudrf-terr-pods/msudrf-terr-pods.parser.js';
import { FsspSefizlicoParser } from '../parsers/fssp-sefizlico/fssp-sefizlico.parser.js';
import { ParserTaskEntity } from '../entities/parser-task.entity.js';
import { PARSER_KEY, PARSER_KEY_BY_INDEX } from '../shared/constants/parsing.js';

export class ParserFactory {

    public create(parserTask: ParserTaskEntity): ParserBase {
        const parserKey = PARSER_KEY_BY_INDEX[parserTask.parser_index];
        switch (parserKey) {
            case PARSER_KEY.MSUDRF_SUD_DELO: {
                return new MsudrfSudDeloParser(parserTask.input_data['fio']);
            }
            case PARSER_KEY.MSUDRF_TERR_PODS: {
                return new MsudrfTerrPodsParser(parserTask.input_data['address']);
            }
            case PARSER_KEY.FSSP_SEFIZLICO: {
                return new FsspSefizlicoParser(
                    parserTask.input_data['fio'],
                    parserTask.input_data['dob'],
                    parserTask.input_data['reg'],
                );
            }
            default: {
                throw new Error(`Unknown parsing request: ${JSON.stringify(parserTask)}`);
            }
        }
    }
}
