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
import { FsspSefizlicoParser } from './parsers/fssp-sefizlico/fssp-sefizlico.parser.js';
import { services } from './services/services.js';
import fs from 'node:fs';
import { ParserTaskEntity } from './entities/parser-task.entity.js';
import { ParserFactory } from './factories/parser.factory.js';
import { ParsingError } from './errors/parsing/parsing.error.js';

listeners.bindAll();

process.on('uncaughtException', async (error) => {
    bus.emit('uncaught-exception', error);
    console.log(helpers.consoleHeader('uncaughtException ', 40, '~!', 31));
    console.error(error);
    console.log(helpers.colorizeForConsole(31, '='.repeat(80)));
});

process.on('unhandledRejection', async (error) => {
    if (error instanceof ParsingError) {
        console.log('parsing error');
        console.log(helpers.consoleHeader('timeout', 80, '~', 32));
        console.error(error);
        console.log(helpers.colorizeForConsole(32, '~'.repeat(80)));
        return;
    }
    bus.emit('unhandled-rejection', error);
    console.log(helpers.consoleHeader('unhandledRejection', 40, '~!', 31));
    console.error(error);
    console.log(helpers.colorizeForConsole(31, '+-'.repeat(40)));
});

// process.on('exit', function () {
//     console.log('process on exit');
//     require('child_process').spawn(process.argv.shift(), process.argv, {
//         cwd: process.cwd(),
//         detached: true,
//         stdio: 'inherit',
//     });
// });

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

        // services.parsingLoop.run();

        // const fsspSefizlicoParser = new FsspSefizlicoParser('qwe', 'asd', 'zxc');
        // const sourceHtml = fs.readFileSync('/var/www/shp/parsing/shp-parsing/back/storage/result_html/fssp/search-ext-fizicheskoe-lico/143.html').toString();
        // const resultJson = fsspSefizlicoParser.extractJson(sourceHtml);
        // console.log(JSON.stringify(resultJson));

        // const parser = new FsspSefizlicoParser(
        //     'Фролов Сергей Павлович',
        //     '27.02.1963',
        //     'Саратовская область',
        // );
        // const parserTask=
        // const parser = new FsspSefizlicoParser(
        //     'ТРОКИНА ТАТЬЯНА ГЕННАДИЕВНА',
        //     '20.08.1978',
        //     'Саратовская область',
        // );
        // parser.run();
        const mgr = db.createEntityManager();
        const taskRepo = mgr.getRepository(ParserTaskEntity);
        const taskEnt = await taskRepo.findOneBy({ id: 144 });
        const parserFactory = new ParserFactory();
        const parser = parserFactory.create(taskEnt);
        const result = await parser.run();
        // console.log(parser);
    };

    fastify.listen({ port: env.FASTIFY_PORT }, onServerStart);

})();

async function parseMany() {

    const qr = db.createQueryRunner();
    const items = await qr.query(`
        select *
        from fssp_primer_na_parsing
        where result_bad is null
        order by id
    `);

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(item);
        console.log('='.repeat(50));
        const parser = new FsspSefizlicoParser(item.fio, item.dob, item.region);
        const result = await parser.run();
        if (result.success) {
            const resultJson = parser.extractJson(result.resultHtml[0]);
            console.log(resultJson);
            await db.createQueryBuilder()
                .update('fssp_primer_na_parsing')
                .set({ result_bad: resultJson })
                .where({ id: item.id })
                .execute();
        }
        // break;
    }
}