import { StdResult } from '../types/common.js';
import { EmitsToBus } from '../classes/emits-to-bus.js';

export abstract class ParserBase extends EmitsToBus {

    public abstract run<TResult>(): Promise<StdResult<TResult>>;

    public abstract extractJson(html: string);
}
