import { Static, Type } from '@sinclair/typebox';
import { genericDictionarySchema } from '../common.js';
import { parserKeySchema } from './common.js';

////////////////////////////////////////////////////////////////////////////////
// Common
export const parserTaskSchema = Type.Object({
    id: Type.Number(),
    parser_index: Type.Number(),
    parser_key: parserKeySchema,
    created_at: Type.Date(),
    status: Type.Union([
        Type.Literal('new'),
        Type.Literal('started'),
        Type.Literal('success'),
        Type.Literal('failed'),
    ]),
    input_data: genericDictionarySchema,
    result_data: genericDictionarySchema,
});
export type ParserTaskType = Static<typeof parserTaskSchema>;
////////////////////////////////////////////////////////////////////////////////
// Get one
export const parserTaskGetOneResultSchema = parserTaskSchema;
////////////////////////////////////////////////////////////////////////////////
// Get many
export const parserTaskGetManyQuerySchema = Type.Object({
    offset: Type.Optional(Type.Number({
        minimum: 0,
    })),
    limit: Type.Optional(Type.Number({
        minimum: 1,
        maximum: 100,
    })),
    parser: Type.Optional(parserKeySchema),
    status: Type.Optional(Type.Union([
        Type.Literal('new'),
        Type.Literal('started'),
        Type.Literal('success'),
        Type.Literal('failed'),
    ])),
});
export type ParserTaskGetManyQueryType = Static<typeof parserTaskGetManyQuerySchema>

export const parserTaskGetManyResultSchema = Type.Object({
    items: Type.Array(parserTaskSchema),
    total: Type.Number(),
});
export type ParserTaskGetManyResultType = Static<typeof parserTaskGetManyResultSchema>
////////////////////////////////////////////////////////////////////////////////
