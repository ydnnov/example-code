import { ElementHandle } from 'playwright';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { FgrIssIpPage } from './fgr.iss-ip.page.js';
import { FgrCaptchaForm } from './fgr.captcha.form.js';
import { RaceResult, StdResult } from '../../types/common.js';

const REGION_DD = '#region_id_chosen input';
const LASTNAME_INP = '[name="is[last_name]"]';
const FIRSTNAME_INP = '[name="is[first_name]"]';
const MIDNAME_INP = '[name="is[patronymic]"]';
const DOB_INP = '[name="is[date]"]';
const SEARCH_BTN = '#btn-sbm';

export class FgrIssIpSfizlicoForm extends EmitsToBus {

    protected eventPrefix = 'fgr.iss-ip-sfizlico.form';

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

    public async attach(timeout: number): Promise<RaceResult> {
        const from = 'sfizlico-form.attach';
        const state = 'attached';
        const elementWait = [
            this.pwpage.waitForSelector(REGION_DD, { state }),
            this.pwpage.waitForSelector(LASTNAME_INP, { state }),
            this.pwpage.waitForSelector(FIRSTNAME_INP, { state }),
            this.pwpage.waitForSelector(MIDNAME_INP, { state }),
            this.pwpage.waitForSelector(DOB_INP, { state }),
            this.pwpage.waitForSelector(SEARCH_BTN, { state }),
        ];
        const result = await Promise.race([
            Promise.all(elementWait),
            new Promise((resolve) => {
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
        this.regionDropdownEl = result[0];
        this.lastnameInputEl = result[1];
        this.firstnameInputEl = result[2];
        this.midnameInputEl = result[3];
        this.dobInputEl = result[4];
        this.searchButtonEl = result[5];
        return {
            success: true,
            from,
        };
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

        return {
            success: true,
        };
    }

    public async submitSearch(timeout: number): Promise<RaceResult<{
        captchaForm: FgrCaptchaForm
    }>> {
        const from = 'sfizlico-form.submit';
        await this.searchButtonEl.click();
        const captchaForm = new FgrCaptchaForm(this.site);
        const result = await Promise.race([
            captchaForm.attach(timeout),
            this.site.handleSomethingWentWrongMessage(),
        ]);
        if (result.success === true) {
            return {
                success: true,
                captchaForm,
                from,
            };
        }
        return result;
    }
}
