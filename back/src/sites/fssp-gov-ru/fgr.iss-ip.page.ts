import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FgrIssIpSfizlicoForm } from './fgr.iss-ip-sfizlico.form.js';
import { FsspGovRuSite } from './fssp-gov-ru.site.js';

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

    public async open(timeout: number) {
        await this.emit('opening');
        await this.pwpage.goto(this.pageUrl);
        const attached = await this.searchForm.attach(timeout);
        return attached;
    }
}
