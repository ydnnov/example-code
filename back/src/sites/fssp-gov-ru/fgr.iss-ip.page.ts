// import { ElementHandle } from 'playwright';
// import { pwpage } from '../../pwpage.js';
// import { FsspSefizlicoForm } from './fssp-sefizlico.form.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FgrIssIpSfizlicoForm } from './fgr.iss-ip-sfizlico.form.js';
import { FsspGovRuSite } from './fssp-gov-ru.site.js';

export class FgrIssIpPage extends EmitsToBus {

    protected eventPrefix = 'fssp-gov-ru.iss-ip.page';

    protected pageUrl = 'https://fssp.gov.ru/iss/ip';

    public readonly searchForm: FgrIssIpSfizlicoForm;

    constructor(public readonly site: FsspGovRuSite) {
        super();

        this.searchForm = new FgrIssIpSfizlicoForm(this);
    }

    public async open(timeout: number) {

        await this.emit('opening');

        await this.site.pwpage.goto(this.pageUrl);

        // const searchForm = new FgrIssIpSfizlicoForm(this);

        // console.log({ searchForm });

        await this.searchForm.attach(timeout);

        // console.log({ searchForm });
    }
}
