import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FgrIssIpPage } from './fgr.iss-ip.page.js';
import { Page } from 'playwright';
import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';

const SMTH_WRONG_MSG = '.iss .results .empty';
const SMTH_WRONG_TXT = 'Извините, что-то пошло не так. Попробуйте позже';

export class FsspGovRuSite extends EmitsToBus {

    protected eventPrefix = 'fssp-gov-ru.site';

    public readonly issIpPage: FgrIssIpPage;

    constructor(
        public readonly pwpage: Page,
        public readonly taskAttemptEntity: ParserTaskAttemptEntity,
    ) {
        super();

        this.issIpPage = new FgrIssIpPage(this);
    }

    public async hasSomethingWentWrongMessage() {
        const elem = await this.pwpage.$(SMTH_WRONG_MSG);
        console.log('hasSomethingWentWrongMessage');
        console.log({ elem });
        return !!elem;
    }

    public async waitSomethingWentWrongMessage(timeout: number) {
        const state = 'attached';
        const elem = await this.pwpage.waitForSelector(SMTH_WRONG_MSG, { timeout, state });
        console.log('waitSomethingWentWrongMessage');
        console.log({ elem });
        return !!elem;
    }
}
