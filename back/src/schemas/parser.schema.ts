import { Static, Type } from '@sinclair/typebox';

////////////////////////////////////////////////////////////////////////////////
export const parserNameSchema = Type.Union([
    Type.Literal('msudrf/sud-delo'),
]);
export type ParserNameType = Static<typeof parserNameSchema>
////////////////////////////////////////////////////////////////////////////////
export const parserMsudrfSudDeloBodySchema = Type.Object({
    parserName: Type.Literal('msudrf/sud-delo'),
    inputData: Type.Object({
        searchText: Type.String(),
    }),
});
export type ParserMsudrfSudDeloBodyType = Static<typeof parserMsudrfSudDeloBodySchema>
////////////////////////////////////////////////////////////////////////////////
export const parserStartBodySchema = Type.Union([
    parserMsudrfSudDeloBodySchema,
]);
export type ParserStartBodyType = Static<typeof parserStartBodySchema>
////////////////////////////////////////////////////////////////////////////////
