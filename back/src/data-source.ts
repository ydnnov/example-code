import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './envconf.js';
import * as migrations from '../migrations/migrations.js';
import * as entities from './entities/entities.js';

export const db = new DataSource({
    type: 'postgres',
    synchronize: false,
    host: env.PG_HOST,
    port: env.PG_PORT,
    database: env.PG_DATABASE,
    username: env.PG_USER,
    password: env.PG_PASS,
    logging: false,
    // logging: 'all',
    // logger: 'advanced-console',
    entities,
    migrations,
    subscribers: [],
});
