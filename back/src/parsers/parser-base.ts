import { OperationResult } from '../types/common.js';

export abstract class ParserBase {

    public abstract run(): Promise<OperationResult<string>>;

    public abstract extractJson(html: string);
}
