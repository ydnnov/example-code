import { StdResult } from '../types/common.js';
import { EmitsToBus } from '../classes/emits-to-bus.js';
import { ParserTaskEntity } from '../entities/parser-task.entity.js';

export abstract class ParserBase extends EmitsToBus {

    constructor(
        public readonly parserTask: ParserTaskEntity,
    ) {
        super();
    }

    public abstract run<TResult>(): Promise<StdResult<TResult>>;

    public abstract extractJson(html: string);
}
