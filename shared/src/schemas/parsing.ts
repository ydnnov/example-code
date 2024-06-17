import { Static, Type } from '@sinclair/typebox';
import { PARSER_NAME } from '../constants/parsing.js';

////////////////////////////////////////////////////////////////////////////////
export const parserInputDataSchema = {
    msudrfSudDelo: Type.Object({
        fio: Type.String(),
    }),
    msudrfTerrPods: Type.Object({
        address: Type.String(),
    }),
    fsspSefizlico: Type.Object({
        fio: Type.String(),
        dob: Type.String(),
        reg: Type.String(),
    }),
};
////////////////////////////////////////////////////////////////////////////////
export const parserMsudrfSudDeloBodySchema = Type.Object({
    parserName: Type.Literal(PARSER_NAME.MSUDRF_SUD_DELO),
    inputData: parserInputDataSchema.msudrfSudDelo,
});
////////////////////////////////////////////////////////////////////////////////
export const parserMsudrfTerrPodsBodySchema = Type.Object({
    parserName: Type.Literal(PARSER_NAME.MSUDRF_TERR_PODS),
    inputData: parserInputDataSchema.msudrfTerrPods,
});
////////////////////////////////////////////////////////////////////////////////
export const parserFsspSefizlicoBodySchema = Type.Object({
    parserName: Type.Literal(PARSER_NAME.FSSP_SEFIZLICO),
    inputData: parserInputDataSchema.fsspSefizlico,
});
////////////////////////////////////////////////////////////////////////////////
export const parserTaskCreateOneBodySchema = Type.Union([
    parserMsudrfSudDeloBodySchema,
    parserMsudrfTerrPodsBodySchema,
    parserFsspSefizlicoBodySchema,
]);
export type ParserTaskCreateOneBodyType = Static<typeof parserTaskCreateOneBodySchema>
////////////////////////////////////////////////////////////////////////////////
export const parserNameSchema = Type.Union([
    Type.Literal(PARSER_NAME.MSUDRF_SUD_DELO),
    Type.Literal(PARSER_NAME.MSUDRF_TERR_PODS),
    Type.Literal(PARSER_NAME.FSSP_SEFIZLICO),
]);
export type ParserNameType = Static<typeof parserNameSchema>
////////////////////////////////////////////////////////////////////////////////
