import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { ParsingError } from './parsing.error.js';

export class ParsingAttemptError extends ParsingError {

    constructor(
        public readonly taskAttemptEntity: ParserTaskAttemptEntity,
    ) {
        super('ParsingAttemptError');
    }
}
