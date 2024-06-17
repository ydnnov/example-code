import { Static, Type } from '@sinclair/typebox';
import { genericDictionarySchema } from '../common.js';
import { parserNameSchema } from '../parsing.js';

////////////////////////////////////////////////////////////////////////////////
// Common
export const parserTaskSchema = Type.Object({
    id: Type.Number(),
    parser_id: Type.Number(),
    created_at: Type.String(),
    status: Type.Union([
        Type.Literal('new'),
        Type.Literal('started'),
        Type.Literal('success'),
        Type.Literal('failed'),
    ]),
    input_data: genericDictionarySchema,
    result_data: genericDictionarySchema,
});
////////////////////////////////////////////////////////////////////////////////
// Get one
export const parserTaskGetOneResultSchema = parserTaskSchema;
////////////////////////////////////////////////////////////////////////////////
// Get many
export const parserTaskGetManyParamsSchema = Type.Object({
    pageNum: Type.Optional(Type.Number()),
    perPage: Type.Optional(Type.Number()),
    parser: Type.Optional(parserNameSchema),
    status: Type.Optional(Type.Union([
        Type.Literal('new'),
        Type.Literal('started'),
        Type.Literal('success'),
        Type.Literal('failed'),
    ])),
});
export type ParserTaskGetManyParamsType = Static<typeof parserTaskGetManyParamsSchema>

export const parserTaskGetManyResultSchema = Type.Object({
    numFound: Type.Number(),
    items: Type.Array(parserTaskSchema),
});
export type ParserTaskGetManyResultType = Static<typeof parserTaskGetManyResultSchema>
////////////////////////////////////////////////////////////////////////////////
