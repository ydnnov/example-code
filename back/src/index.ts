import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';

import { env } from './envconf.js';
import { fastify } from './fastify.js';
import { db } from './data-source.js';
import { logger } from './logger.js';
import { helpers } from './helpers/helpers.js';
import { routes } from './routes/routes.js';
import { websocket } from './websocket.js';

process.on('unhandledRejection', (error) => {
    console.error(error);
    throw error;
});

(async () => {

    fastify.register(fastifyCors, { origin: '*' });
    fastify.register(fastifyFormbody);

    fastify.register(routes);

    await db.initialize();

    const onServerStart = async (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        websocket.on('connection', (socket) => {
            logger.verbose(`${
                helpers.fmtDateTime(new Date())
            }: wss connected client id = ${socket.id}`);
        });

        console.log('='.repeat(100));
        logger.info(`Server started at ${address}`);
        console.log('='.repeat(100));
    };

    fastify.listen({ port: env.FASTIFY_PORT }, onServerStart);

})();
