import { Static, Type } from '@sinclair/typebox';
import { parserTaskAttemptRunOptionsSchema } from './common.js';

////////////////////////////////////////////////////////////////////////////////
export const parserTaskAttemptCreateOneSchema = {
    taskId: Type.Number(),
    runOptions: parserTaskAttemptRunOptionsSchema,
};
export type parserTaskAttemptCreateOneType = Static<typeof parserTaskAttemptCreateOneSchema>
////////////////////////////////////////////////////////////////////////////////
