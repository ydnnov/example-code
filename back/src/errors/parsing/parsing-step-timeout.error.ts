import { ParsingAttemptError } from './parsing-attempt.error.js';
import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';

export class ParsingStepTimeoutError extends ParsingAttemptError {

    constructor(
        taskAttemptEntity: ParserTaskAttemptEntity,
        public readonly stepKey: string,
    ) {
        super(taskAttemptEntity);
    }
}
