import * as cheerio from 'cheerio';
import { bag } from '../../bag.js';
import { bus } from '../../bus.js';
import { db } from '../../data-source.js';
import { StdResult } from '../../types/common.js';
import { ParserBase } from '../parser-base.js';
import { pwpage } from '../../pwpage.js';
import { FsspSefizlicoAttemptHandler } from './fssp-sefizlico.attempt-handler.js';
import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';

export class FsspSefizlicoParser extends ParserBase {

    protected eventPrefix = 'fssp-sefizlico.parser';

    public async run(): Promise<StdResult<{ resultHtml: string[] }>> {

        this.emit('started');

        const mgr = db.createEntityManager();

        const taskAttemptRepo = mgr.getRepository(ParserTaskAttemptEntity);

        const resultHtml = [];

        // let lastError;
        let stop = false;
        // let paused = true;
        let i = 0;
        bus.on('parsing.stop', () => {
            stop = true;
        });
        while(!stop) {
            await this.emit('attempt', { num: i + 1 });
            // let attemptEnt = new ParserTaskAttemptEntity();
            // attemptEnt.parser_task_id = this.parserTask.id;
            // await taskAttemptRepo.save(attemptEnt);
            // attemptEnt = await taskAttemptRepo.findOneBy({ id: attemptEnt.id });
            let attemptEnt = await taskAttemptRepo.findOneBy({ id: 3 });
            const attemptHandler = new FsspSefizlicoAttemptHandler(this, attemptEnt, pwpage);
            bag['attemptHandler'] = attemptHandler;
            const attemptResult = await attemptHandler.perform();
            console.log(
                '------------------------------> Parser attempt ended with result',
                { attemptResult },
            );
            await new Promise((resolve) => {
                const handler = (event: string, ...args) => {
                    if (['parsing.restart', 'parsing.step'].includes(event)) {
                        bus.emitter.offAny(handler);
                        resolve();
                    } else if (event === 'parsing.stop') {
                        bus.emitter.offAny(handler);
                        stop = true;
                        resolve();
                    }
                };
                bus.onAny(handler);
            });

            // break;
            // process.exit(0);
            // console.log({result});
            // if (result) {
            //     return {
            //         success: true,
            //         resultHtml: [String(result)],
            //     };
            // }
            //
            //
            // // if (!result) {
            // //     throw new Error('Failed parsing attempt');
            // // }
            // // const attempt=new FsspSefizlicoAttemptHandler()
            //
            // // await pwpageRecreate();
            // //
            // // const site = new FsspGovRuSite(pwpage);
            // //
            // // await site.issIpPage.open(100);
            // // // site.issIpPage.searchForm.inputFields()
            // //
            // // console.log({ issIpPage: site.issIpPage });
            //
            // // issIpPage.
            //
            // // } catch (err) {
            // //     console.log(err);
            //
            // // if (!issIpPage) {
            // //     await bus.emit('error.failed-to-open-iss-ip-page');
            // //     lastError = 'Failed to open iss ip page, site might be down';
            // //     continue;
            // // }
            // // }
            // i++;
        }

        return {
            success: false,
            err: 'lastError',
        };
    }

    public extractJson(html: string) {

        const $ = cheerio.load(html);

        const trElems = $('.results-frame table tr');
        const resultItems = [];
        for (let i = 1; i < trElems.length; i++) {
            const tdElems = $(trElems[i]).children('td');
            const resultItem = {
                dolzhnik: $(tdElems[0]).text(),
                ispol_proizv: $(tdElems[1]).text(),
                rekvizity_ispol_dok: $(tdElems[2]).text(),
                data_prichina_okonch_ip: $(tdElems[3]).text(),
                servis: $(tdElems[4]).text(),
                predmet_ispol_summa_zadolzh: $(tdElems[5]).text(),
                otdel_sud_prist: $(tdElems[6]).text(),
                sud_pristav: $(tdElems[7]).text(),
            };
            resultItems.push(resultItem);
        }

        return resultItems;
    }
}
