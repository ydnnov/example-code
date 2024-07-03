import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FgrIssIpSfizlicoForm } from './fgr.iss-ip-sfizlico.form.js';
import { FsspGovRuSite } from './fssp-gov-ru.site.js';
import { RaceResult } from '../../types/common.js';
import { helpers } from '../../helpers/helpers.js';

export class FgrIssIpPage extends EmitsToBus {

    protected eventPrefix = 'fgr.iss-ip.page';

    protected pageUrl = 'https://fssp.gov.ru/iss/ip';

    public readonly searchForm: FgrIssIpSfizlicoForm;

    constructor(public readonly site: FsspGovRuSite) {
        super();

        this.searchForm = new FgrIssIpSfizlicoForm(this);
    }

    get pwpage() {
        return this.site.pwpage;
    }

    public async open(timeout: number): Promise<RaceResult> {
        const from = 'iss-ip-page.open';
        await this.emit('before-open', { timeout });
        // console.log('this.pwpage', this.pwpage);
        // console.log('this.pageUrl', this.pageUrl);
        this.pwpage.goto(this.pageUrl)
            .then((...args) => {
                console.log(`this.pwpage.goto(this.pageUrl) THEN`, { args });
            })
            .catch((...args) => {
                console.log(`this.pwpage.goto(this.pageUrl) CATCH`, { args });
            });
        // console.log('goto---------------------');
        // await this.emit('goto', { timeout });
        const result = Promise.race([
            this.searchForm.attach(timeout),
            this.site.handleSomethingWentWrongMessage(),
            helpers.raceTimeout(from, timeout),
        ]);
        // console.log('#'.repeat(100));
        // console.log('#'.repeat(100));
        // console.log('#'.repeat(100));
        // console.log('#'.repeat(100));
        // console.log('#'.repeat(100));
        // console.log('open result', await result);
        return result;
    }
}
