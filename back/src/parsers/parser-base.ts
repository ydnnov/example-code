import { StdResult } from '../types/common.js';
import { EmitsToBus } from '../classes/emits-to-bus.js';

export abstract class ParserBase extends EmitsToBus {

    // TODO позднее, нужно будет задействовать шаблонный тип <T>
    //      вместо конерктного { resultHtml: string }
    //      то есть вот так:
    // public abstract run<TResultData>(): Promise<StdResult<TResultData>>;

    public abstract run(): Promise<StdResult<{ resultHtml: string }>>;

    public abstract extractJson(html: string);
}
