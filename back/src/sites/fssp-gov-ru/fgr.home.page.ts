import { pwpage } from '../../pwpage.js';
import { FsspSefizlicoForm } from './fssp-sefizlico.form.js';
import { ElementHandle } from 'playwright';
import { type } from 'node:os';
import { helpers } from '../../helpers/helpers.js';
import { EmitsToBus } from '../../classes/emits-to-bus.js';

export class FgrHomePage extends EmitsToBus {

    protected eventPrefix = 'fssp-gov-ru.home-page';

    protected pageUrl = 'https://fssp.gov.ru';
    protected startModalCloseSel = 'div[class*="-ModalClose"]';

    public async open() {
        await this.emit('opening');
        await pwpage.goto(this.pageUrl);
    }

    public async waitReady(timeout: number): Promise<boolean> {
        try {
            const searchForm = new FsspSefizlicoForm();
            const promises = [
                searchForm.waitReady(timeout),
                pwpage.waitForSelector(
                    this.startModalCloseSel, { timeout },
                ),
            ];
            const [searchFormReady, startModalOpen]
                = await Promise.all<boolean | ElementHandle>(promises);
            if (!searchFormReady && startModalOpen) {
                await this.emit('ready');
                return true;
            } else {
                await this.emit('error.failed-to-open');
                return false;
            }
        } catch (err) {
            await this.emit('error.failed-to-open');
            return false;
        }
    }

    public async closeStartModal(timeout: number) {
        await this.emit('closing-start-modal');
        const el = await pwpage.waitForSelector(
            this.startModalCloseSel, { timeout },
        );
        if (!!el) {
            await pwpage.click(this.startModalCloseSel);
            await this.emit('closed-start-modal');
        } else {
            await this.emit('start-modal-element-not-found');
        }
    }

    public async getSearchForm(timeout: number) {
        const form = new FsspSefizlicoForm();
        const isReady = await form.waitReady(timeout);
        if (isReady) {
            return form;
        }
        return null;
    }
}
