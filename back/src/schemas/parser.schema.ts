import { Static, Type } from '@sinclair/typebox';

////////////////////////////////////////////////////////////////////////////////
export const parserMsudrfSudDeloBodySchema = Type.Object({
    parserName: Type.Literal('msudrf/sudebnoye-deloproizvodstvo'),
    inputData: Type.Object({
        fio: Type.String(),
    }),
});
////////////////////////////////////////////////////////////////////////////////
export const parserTerrPodsBodySchema = Type.Object({
    parserName: Type.Literal('msudrf/territorialnaya-podsudnost'),
    inputData: Type.Object({
        address: Type.String(),
    }),
});
////////////////////////////////////////////////////////////////////////////////
export const parserStartBodySchema = Type.Union([
    parserMsudrfSudDeloBodySchema,
    parserTerrPodsBodySchema,
]);
export type ParserStartBodyType = Static<typeof parserStartBodySchema>
////////////////////////////////////////////////////////////////////////////////
