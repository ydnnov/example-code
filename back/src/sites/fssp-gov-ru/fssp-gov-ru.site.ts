import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FgrIssIpPage } from './fgr.iss-ip.page.js';
import { ParserStepTimeoutError } from '../../errors/parsing/parser-step-timeout.error.js';
import { Page } from 'playwright';
import { FgrIssIpSfizlicoForm } from './fgr.iss-ip-sfizlico.form.js';

export class FsspGovRuSite extends EmitsToBus {

    protected eventPrefix = 'fssp-gov-ru.site';

    public readonly issIpPage: FgrIssIpPage;

    constructor(public readonly pwpage: Page) {
        super();

        this.issIpPage = new FgrIssIpPage(this);
    }

    // public async openIssIpPage(timeout: number, dontThrow: boolean = false)
    //     : Promise<FgrIssIpPage> {
    //     this.emit('opening-iss-ip-page');
    //     await page.open();
    //     const isReady = await page.waitReady(timeout);
    //     if (isReady) {
    //         this.emit('opening-iss-ip-page.success');
    //         return page;
    //     }
    //     if (dontThrow) {
    //         this.emit('opening-iss-ip-page.failure');
    //         return null;
    //     }
    //     throw new ParserStepTimeoutError('open-iss-ip-page');
    // }
}
