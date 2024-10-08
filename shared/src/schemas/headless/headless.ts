import { Static, Type } from '@sinclair/typebox';

////////////////////////////////////////////////////////////////////////////////
export const headlessTabSchema = Type.Object({
    id: Type.Number(),
    url: Type.String(),
});
export type HeadlessTabType = Static<typeof headlessTabSchema>
////////////////////////////////////////////////////////////////////////////////
