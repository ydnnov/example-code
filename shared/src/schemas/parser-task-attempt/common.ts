import { Static, Type } from '@sinclair/typebox';

////////////////////////////////////////////////////////////////////////////////
export const parserTaskAttemptRunOptionsSchema = Type.Object({
    timeout: Type.Number(),
});
export type ParserTaskAttemptRunOptionsType = Static<typeof parserTaskAttemptRunOptionsSchema>
////////////////////////////////////////////////////////////////////////////////
