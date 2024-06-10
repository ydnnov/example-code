import { Static, Type } from '@sinclair/typebox';

////////////////////////////////////////////////////////////////////////////////
export const parserMsudrfSudDeloBodySchema = Type.Object({
    parserName: Type.Literal('msudrf/sudebnoye-deloproizvodstvo'),
    inputData: Type.Object({
        fio: Type.String(),
    }),
});
////////////////////////////////////////////////////////////////////////////////
export const parserMsudrfTerrPodsBodySchema = Type.Object({
    parserName: Type.Literal('msudrf/territorialnaya-podsudnost'),
    inputData: Type.Object({
        address: Type.String(),
    }),
});
export const parserFsspSefizlicoBodySchema = Type.Object({
    parserName: Type.Literal('fssp/search-ext-fizicheskoe-lico'),
    inputData: Type.Object({
        fio: Type.String(),
        dob: Type.String(),
        reg: Type.String(),
    }),
});
////////////////////////////////////////////////////////////////////////////////
export const parserStartBodySchema = Type.Union([
    parserMsudrfSudDeloBodySchema,
    parserMsudrfTerrPodsBodySchema,
    parserFsspSefizlicoBodySchema,
]);
export type ParserStartBodyType = Static<typeof parserStartBodySchema>
////////////////////////////////////////////////////////////////////////////////
