import { ElementHandle } from 'playwright';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FsspGovRuSite } from './fssp-gov-ru.site.js';
import { RaceResult, StdResult } from '../../types/common.js';

const RESULTS_TBL = '.iss .results table.table';
const PAGINATION = '.iss .results .pagination';
const PAGINATION_LN = '.iss .results .pagination a';

export class FgrIisfResultsPage extends EmitsToBus {

    protected eventPrefix = 'fgr-iisf.results-page';

    protected resultsTableEl: ElementHandle;

    constructor(public readonly site: FsspGovRuSite) {
        super();
    }

    get pwpage() {
        return this.site.pwpage;
    }

    public async attach(timeout: number): Promise<RaceResult<{}, string>> {
        const from = 'iisf-results-page.attach';
        const state = 'attached';
        const elementWait = [
            this.pwpage.waitForSelector(RESULTS_TBL, { state }),
        ];
        const result = await Promise.race([
            Promise.all(elementWait),
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve('timeout');
                }, timeout);
            }),
        ]);
        if (result === 'timeout') {
            return {
                success: false,
                err: 'timeout',
                from,
            };
        }
        this.resultsTableEl = result[0];
        return {
            success: true,
            from,
        };
    }

    public async getPaginationEl() {
        return this.pwpage.$(PAGINATION);
    }

    public async getPagination() {
        const links = await this.pwpage.$$(PAGINATION_LN);
        const result = [];
        for (let i = 0; i < links.length; i++) {
            const el = links[i];
            result.push({
                el,
                cls: (await el.getProperty('class')).toString(),
                clsn: (await el.getProperty('className')).toString(),
            });
        }
        console.log({ result });
    }
}
