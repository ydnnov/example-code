import { Static, Type } from '@sinclair/typebox';
import { PARSER_NAME } from '../../constants/parsing.js';

////////////////////////////////////////////////////////////////////////////////
export const parserNameSchema = Type.Union([
    Type.Literal(PARSER_NAME.MSUDRF_SUD_DELO),
    Type.Literal(PARSER_NAME.MSUDRF_TERR_PODS),
    Type.Literal(PARSER_NAME.FSSP_SEFIZLICO),
]);
export type ParserNameType = Static<typeof parserNameSchema>
////////////////////////////////////////////////////////////////////////////////
