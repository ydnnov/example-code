import { Static, Type } from '@sinclair/typebox';

export const headlessGotoBodySchema = Type.Object({
    url: Type.String(),
});
export type HeadlessGotoBodyType = Static<typeof headlessGotoBodySchema>
////////////////////////////////////////////////////////////////////////////////
export const headlessOnClickBodySchema = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
});
export type HeadlessOnClickBodyType = Static<typeof headlessOnClickBodySchema>
////////////////////////////////////////////////////////////////////////////////
export const headlessOnKeypressBodySchema = Type.Object({
    key: Type.String(),
    code: Type.String(),
});
export type HeadlessOnKeypressBodyType = Static<typeof headlessOnKeypressBodySchema>
////////////////////////////////////////////////////////////////////////////////
