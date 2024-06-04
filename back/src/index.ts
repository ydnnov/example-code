import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';

import { env } from './envconf.js';
import { fastify } from './fastify.js';
import { db } from './data-source.js';
import { logger } from './logger.js';
import { helpers } from './helpers/helpers.js';
import { routes } from './routes/routes.js';
import { listeners } from './listeners/listeners.js';
import { bus } from './bus.js';
import { pwpageReadyPromise } from './pwpage.js';

listeners.bindAll();

process.on('uncaughtException', async (error) => {
    bus.emit('uncaught-exception', error);
    console.log(helpers.colorizeForConsole(31,
        helpers.consoleHeaderText('uncaughtException ', '!'),
    ));
    console.error(error);
    console.log(helpers.colorizeForConsole(31, '='.repeat(80)));
});

process.on('unhandledRejection', async (error) => {
    bus.emit('unhandled-rejection', error);
    console.log(helpers.colorizeForConsole(31,
        helpers.consoleHeaderText('unhandledRejection ', '!'),
    ));
    console.error(error);
    console.log(helpers.colorizeForConsole(31, '+-'.repeat(40)));
});

(async () => {

    fastify.register(fastifyCors, { origin: '*' });
    fastify.register(fastifyFormbody);

    fastify.register(routes);

    await db.initialize();

    await pwpageReadyPromise;

    const onServerStart = async (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        // bus.emit('app-started');

        // console.clear();
        console.log('='.repeat(80));
        logger.info(`Server started at ${address}`);
        console.log('='.repeat(80));
    };

    fastify.listen({ port: env.FASTIFY_PORT }, onServerStart);

})();
