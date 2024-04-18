import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';
import Ajv from 'ajv';

export const fastify = Fastify({
    logger: false,
    // ajv: {
    //     customOptions: {
    //         coerceTypes: false,
    //     },
    // },
}).withTypeProvider<TypeBoxTypeProvider>();

const schemaCompilers: Record<string, Ajv> = {
    'body': new Ajv({
        // removeAdditional: false,
        coerceTypes: false,
        // allErrors: true,
    }),
    'params': new Ajv({
        // removeAdditional: false,
        coerceTypes: true,
        // allErrors: true,
    }),
    'querystring': new Ajv({
        // removeAdditional: false,
        coerceTypes: true,
        // allErrors: true,
    }),
};

fastify.setValidatorCompiler(req => {
    if (!req.httpPart) {
        throw new Error('Missing httpPart');
    }
    const compiler = schemaCompilers[req.httpPart];
    if (!compiler) {
        throw new Error(`Missing compiler for ${req.httpPart}`);
    }

    return compiler.compile(req.schema);
});