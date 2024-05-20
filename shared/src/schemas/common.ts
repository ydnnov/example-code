import { Static, Type } from '@sinclair/typebox';

export const genericDictionarySchema = Type.Record(Type.String(), Type.Any());
export type GenericDictionary = Static<typeof genericDictionarySchema>
////////////////////////////////////////////////////////////////////////////////
export const eventBusEmitRequestSchema = Type.Object({
    eventName: Type.String(),
    payload: Type.Union([
        genericDictionarySchema,
        Type.String(),
        Type.Number(),
    ]),
});
export type EventBusEmitRequestType = Static<typeof eventBusEmitRequestSchema>
////////////////////////////////////////////////////////////////////////////////
