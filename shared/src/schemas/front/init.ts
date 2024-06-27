import { Static, Type } from '@sinclair/typebox';

////////////////////////////////////////////////////////////////////////////////
export const frontInitSchema = Type.Object({
    parser: Type.Object({
        paused: Type.Boolean(),
    }),
    page: Type.Object({
        url: Type.String(),
    }),
});
export type FrontInitType = Static<typeof frontInitSchema>
////////////////////////////////////////////////////////////////////////////////
