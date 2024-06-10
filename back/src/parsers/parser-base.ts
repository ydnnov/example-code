import { StdResult } from '../types/common.js';
import { EmitsToBus } from '../classes/emits-to-bus.js';

export abstract class ParserBase extends EmitsToBus {

    // TODO здесь лучше задействовать шаблонный тип <T>
    //      вместо конерктного { resultHtml: string }
    public abstract run(): Promise<StdResult<{ resultHtml: string }>>;

    public abstract extractJson(html: string);
}
