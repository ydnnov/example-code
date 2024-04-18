import * as dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';
import { Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const envconfSchema = Type.Object({
    FASTIFY_HOST: Type.String(),
    FASTIFY_PORT: Type.Number(),

    PG_HOST: Type.String(),
    PG_PORT: Type.Number(),
    PG_DATABASE: Type.String(),
    PG_USER: Type.String(),
    PG_PASS: Type.String(),

    STORAGE_PATH: Type.String(),

    LOG_LEVEL_FILE: Type.String(),
    LOG_LEVEL_CONSOLE: Type.String(),
});

type EnvconfType = Static<typeof envconfSchema>

const raw = dotenv.config().parsed;
const parsed = dotenvParseVariables(raw);

for (const key in parsed) {
    const matches = String(parsed[key]).match(/"(.+)"/);
    if (matches) {
        parsed[key] = String(matches[1]);
    }
}

if (!Value.Check(envconfSchema, parsed)) {
    throw new Error(`Invalid .env: ${JSON.stringify([...Value.Errors(envconfSchema, parsed)])}`);
}

export const env: EnvconfType = { ...parsed };
