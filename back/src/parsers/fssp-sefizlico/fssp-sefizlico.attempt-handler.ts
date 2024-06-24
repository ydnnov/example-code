import { ParserTaskAttemptEntity } from '../../entities/parser-task-attempt.entity.js';
import { pwpage, pwpageRecreate } from '../../pwpage.js';
import { FsspGovRuSite } from '../../sites/fssp-gov-ru/fssp-gov-ru.site.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';

export class FsspSefizlicoAttemptHandler extends EmitsToBus {

    protected eventPrefix = 'fssp-sefizlico.attempt-handler';

    constructor(
        public readonly attemptEntity: ParserTaskAttemptEntity,
    ) {
        super();
    }

    public async perform() {
        console.log('#'.repeat(150));
        console.log('FsspSefizlicoParserAttempt.perform()');
        console.log('#'.repeat(150));
        console.log({ attemptEntity: this.attemptEntity });
        // await this.emit('attempt', { num: i + 1 });

        await pwpageRecreate();

        const site = new FsspGovRuSite(pwpage);

        await site.issIpPage.open(100);
        // site.issIpPage.searchForm.inputFields()

        console.log({ issIpPage: site.issIpPage });

    }
}
