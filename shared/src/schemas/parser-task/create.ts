import { Static, Type } from '@sinclair/typebox';
import { PARSER_KEY } from '../../constants/parsing.js';

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
export type ParserInputDataType = Static<typeof parserTaskCreateOneBodySchema>
////////////////////////////////////////////////////////////////////////////////
export const parseWithTimeoutSchema = Type.Object({
    timeout: Type.Optional(Type.Number()),
});
////////////////////////////////////////////////////////////////////////////////
export const parserMsudrfSudDeloBodySchema = Type.Intersect([
    Type.Object({
        parserKey: Type.Literal(PARSER_KEY.MSUDRF_SUD_DELO),
        inputData: parserInputDataSchema.msudrfSudDelo,
    }),
    parseWithTimeoutSchema,
]);
////////////////////////////////////////////////////////////////////////////////
export const parserMsudrfTerrPodsBodySchema = Type.Intersect([
    Type.Object({
        parserKey: Type.Literal(PARSER_KEY.MSUDRF_TERR_PODS),
        inputData: parserInputDataSchema.msudrfTerrPods,
    }),
    parseWithTimeoutSchema,
]);
////////////////////////////////////////////////////////////////////////////////
export const parserFsspSefizlicoBodySchema = Type.Intersect([
    Type.Object({
        parserKey: Type.Literal(PARSER_KEY.FSSP_SEFIZLICO),
        inputData: parserInputDataSchema.fsspSefizlico,
    }),
    parseWithTimeoutSchema,
]);

////////////////////////////////////////////////////////////////////////////////
export const parserTaskCreateOneBodySchema = Type.Union([
    parserMsudrfSudDeloBodySchema,
    parserMsudrfTerrPodsBodySchema,
    parserFsspSefizlicoBodySchema,
]);
export type ParserTaskCreateOneBodyType = Static<typeof parserTaskCreateOneBodySchema>
////////////////////////////////////////////////////////////////////////////////
