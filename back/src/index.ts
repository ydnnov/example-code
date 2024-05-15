import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';

import { env } from './envconf.js';
import { fastify } from './fastify.js';
import { db } from './data-source.js';
import { logger } from './logger.js';
import { helpers } from './helpers/helpers.js';
import { routes } from './routes/routes.js';
import { listeners } from './listeners/listeners.js';

listeners.bindAll();

process.on('uncaughtException', async (error) => {
    // await bus.emitAsync('bk.uncaught-exception', error);
    console.log(helpers.colorizeForConsole(31,
        helpers.consoleHeaderText('uncaughtException ', '!'),
    ));
    console.error(error);
    console.log(helpers.colorizeForConsole(31, '='.repeat(100)));
    // throw error;
});

process.on('unhandledRejection', async (error) => {
    // await bus.emitAsync('bk.unhandled-rejection', error);
    console.log(helpers.colorizeForConsole(31,
        helpers.consoleHeaderText('unhandledRejection ', '!'),
    ));
    console.error(error);
    console.log(helpers.colorizeForConsole(31, '+-'.repeat(50)));
    // console.error(error);
    // throw error;
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

        console.log('='.repeat(100));
        logger.info(`Server started at ${address}`);
        console.log('='.repeat(100));
    };

    fastify.listen({ port: env.FASTIFY_PORT }, onServerStart);

})();
