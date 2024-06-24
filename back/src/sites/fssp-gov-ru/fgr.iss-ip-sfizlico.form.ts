import { ElementHandle } from 'playwright';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { ParsingStepTimeoutError } from '../../errors/parsing/parsing-step-timeout.error.js';
import { FgrIssIpPage } from './fgr.iss-ip.page.js';
import { FgrCaptchaForm } from './fgr.captcha.form.js';

const REGION_DD = '#region_id_chosen input';
const LASTNAME_INP = '[name="is[last_name]"]';
const FIRSTNAME_INP = '[name="is[first_name]"]';
const MIDNAME_INP = '[name="is[patronymic]"]';
const DOB_INP = '[name="is[date]"]';
const SEARCH_BTN = '#btn-sbm';

export class FgrIssIpSfizlicoForm extends EmitsToBus {

    protected eventPrefix = 'fssp-gov-ru.iss-ip-sfizlico.form';

    protected regionDropdownEl: ElementHandle;
    protected lastnameInputEl: ElementHandle;
    protected firstnameInputEl: ElementHandle;
    protected midnameInputEl: ElementHandle;
    protected dobInputEl: ElementHandle;
    protected searchButtonEl: ElementHandle;

    constructor(public readonly page: FgrIssIpPage) {
        super();
    }

    get site() {
        return this.page.site;
    }

    get pwpage() {
        return this.site.pwpage;
    }

    public async attach(timeout: number) {
        const state = 'attached';
        const noop = (err) => {
        };
        const elementWait = [
            this.pwpage.waitForSelector(REGION_DD, { timeout, state }).catch(noop),
            this.pwpage.waitForSelector(LASTNAME_INP, { timeout, state }).catch(noop),
            this.pwpage.waitForSelector(FIRSTNAME_INP, { timeout, state }).catch(noop),
            this.pwpage.waitForSelector(MIDNAME_INP, { timeout, state }).catch(noop),
            this.pwpage.waitForSelector(DOB_INP, { timeout, state }).catch(noop),
            this.pwpage.waitForSelector(SEARCH_BTN, { timeout, state }).catch(noop),
        ];
        const result = await Promise.race([
            Promise.all(elementWait),
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const error = new ParsingStepTimeoutError(
                        this.site.taskAttemptEntity,
                        'sfizlicoform-wait-ready',
                    );
                    reject(error);
                }, timeout);
            }),
        ]);
        this.regionDropdownEl = result[0];
        this.lastnameInputEl = result[1];
        this.firstnameInputEl = result[2];
        this.midnameInputEl = result[3];
        this.dobInputEl = result[4];
        this.searchButtonEl = result[5];
    }

    public async inputFields(fio: string, dob: string, region: string) {

        const fioParts = fio.trim().split(' ');
        if (fioParts.length !== 3) {
            throw new Error(`Invalid fio: "${fio}"`);
        }

        await this.regionDropdownEl.scrollIntoViewIfNeeded();
        await this.regionDropdownEl.focus();
        await this.pwpage.keyboard.type(region);
        await this.pwpage.keyboard.press('Enter');

        await this.lastnameInputEl.focus();
        await this.pwpage.keyboard.type(fioParts[0]);

        await this.firstnameInputEl.focus();
        await this.pwpage.keyboard.type(fioParts[1]);

        await this.midnameInputEl.focus();
        await this.pwpage.keyboard.type(fioParts[2]);

        await this.dobInputEl.scrollIntoViewIfNeeded();
        await this.dobInputEl.click();
        await this.pwpage.keyboard.type(dob);
        await this.pwpage.keyboard.press('Enter');
    }

    public async submitSearch(timeout: number): Promise<FgrCaptchaForm> {
        await this.searchButtonEl.click();
        const form = new FgrCaptchaForm(this.site);
        await form.attach(timeout);
        return form;
    }
}
