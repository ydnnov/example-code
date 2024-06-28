import { Static, Type } from '@sinclair/typebox';
import { headlessTabSchema } from '../headless/headless.js';

////////////////////////////////////////////////////////////////////////////////
export const frontInitSchema = Type.Object({
    tabs: Type.Array(headlessTabSchema),
    parser: Type.Object({
        paused: Type.Boolean(),
    }),
    page: Type.Object({
        url: Type.String(),
    }),
});
export type FrontInitType = Static<typeof frontInitSchema>
////////////////////////////////////////////////////////////////////////////////
