import { Static, Type } from '@sinclair/typebox';

////////////////////////////////////////////////////////////////////////////////
export const parserNameSchema = Type.Union([
    Type.Literal('msudrf/sud-delo'),
]);
export type ParserNameType = Static<typeof parserNameSchema>
////////////////////////////////////////////////////////////////////////////////
export const parserStartBodySchema = Type.Object({
    parserName: parserNameSchema,
    inputData: Type.Object({
        searchText: Type.String(),
    }),
});
export type ParserStartBodyType = Static<typeof parserStartBodySchema>
////////////////////////////////////////////////////////////////////////////////
