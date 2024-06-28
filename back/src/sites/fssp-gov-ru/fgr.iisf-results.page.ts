import { ElementHandle } from 'playwright';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FsspGovRuSite } from './fssp-gov-ru.site.js';
import { RaceResult, StdResult } from '../../types/common.js';

const RESULTS_TBL = '.iss .results table.table';
const PAGINATION = '.iss .results .pagination';
const PAGINATION_LN = '.iss .results .pagination .context>a, ' +
    '.iss .results .pagination .context>span';
const TOTAL_RECS = '.iss .results .search-found-total .search-found-total-inner';

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

    public async getNumFound() {
        const el = await this.pwpage.$(TOTAL_RECS);
        if (!el) {
            return null;
        }
        const text = (await el.getProperty('innerText')).toString();
        const matches = text.match(/\d+/);
        if (!matches || !matches[0]) {
            return null;
        }
        const result = Number(matches[0]);
        return result;
    }

    public async getNumPages() {
        const pagination = await this.getPagination();
        console.log({ pagination });
    }

    public async getPagination() {
        const links = await this.pwpage.$$(PAGINATION_LN);
        const result = [];
        for (let i = 0; i < links.length; i++) {
            const el = links[i];
            const text = (await el.getProperty('innerText')).toString().trim();
            if (!text.match(/\d+/)) {
                continue;
            }
            const pageNum = Number(text);
            const className = (await el.getProperty('className')).toString().trim();
            result.push({
                el,
                pageNum,
                className,
                isActive: className.includes('active'),
                text,
            });
        }
        return result;
    }

    public async openNextPage() {
        const pagination = await this.getPagination();
        const activeIndex = pagination.findIndex(x => x.isActive);
        if (activeIndex >= pagination.length - 1) {
            console.log('last page');
            return false;
        }
        console.log({ activeIndex });
        const nextPage = pagination[activeIndex + 1].el;
        const linkHtml = (await nextPage.getProperty('outerHTML')).toString();
        console.log({ linkHtml });
        await nextPage.click();
    }
}
