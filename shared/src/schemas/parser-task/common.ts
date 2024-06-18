import { Static, Type } from '@sinclair/typebox';
import { PARSER_KEY } from '../../constants/parsing.js';

////////////////////////////////////////////////////////////////////////////////
export const parserKeySchema = Type.Union([
    Type.Literal(PARSER_KEY.MSUDRF_SUD_DELO),
    Type.Literal(PARSER_KEY.MSUDRF_TERR_PODS),
    Type.Literal(PARSER_KEY.FSSP_SEFIZLICO),
]);
export type ParserKeyType = Static<typeof parserKeySchema>
////////////////////////////////////////////////////////////////////////////////
