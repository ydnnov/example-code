import { pwpage } from '../../pwpage.js';
import { helpers } from '../../helpers/helpers.js';
import { StdResult } from '../../types/common.js';
import { ElementHandle } from 'playwright';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { services } from '../../services/services.js';
import { ParserStepTimeoutError } from '../../errors/parsing/parser-step-timeout.error.js';
import { FgrIssIpPage } from './fgr.iss-ip.page.js';

const REGION_DD = '#region_id_chosen input';
const LASTNAME_INP = '[name="is[last_name]"]';
const FIRSTNAME_INP = '[name="is[first_name]"]';
const MIDNAME_INP = '[name="is[patronymic]"]';

export class FgrIssIpSfizlicoForm extends EmitsToBus {

    protected eventPrefix = 'fssp-gov-ru.iss-ip-sfizlico.form';

    protected regionDropdownEl: ElementHandle;
    protected lastnameInputEl: ElementHandle;
    protected firstnameInputEl: ElementHandle;
    protected midnameInputEl: ElementHandle;

    constructor(public readonly page: FgrIssIpPage) {
        super();
    }

    public async attach(timeout: number) {
        const state = 'attached';
        this.regionDropdownEl;
        timeout = 5000;
        const elementWait = [
            pwpage.waitForSelector(REGION_DD, { timeout, state }),
            pwpage.waitForSelector(LASTNAME_INP, { timeout, state }),
            pwpage.waitForSelector(FIRSTNAME_INP, { timeout, state }),
            pwpage.waitForSelector(MIDNAME_INP, { timeout, state }),
        ];
        const result = await Promise.race([
            Promise.all(elementWait),
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const error = new ParserStepTimeoutError('sfizlicoform-wait-ready');
                    console.log(helpers.consoleHeader('timeout', 80, '~', 32));
                    console.error(error);
                    console.log(helpers.colorizeForConsole(32, '~'.repeat(80)));
                    reject(error);
                }, 10000);
            }),
        ]);
        // console.log({ result });
        this.regionDropdownEl = result[0];
        this.lastnameInputEl = result[1];
        this.firstnameInputEl = result[2];
        this.midnameInputEl = result[3];
    }

    public async inputFields(fio: string, dob: string, region: string) {

        const fioParts = fio.trim().split(' ');
        if (fioParts.length !== 3) {
            throw new Error(`Invalid fio: "${fio}"`);
        }

        const lastNameInputEl = await pwpage.waitForSelector('[name="is[last_name]"]', {
            state: 'attached',
        });
        await this.lastnameInputEl.focus()
        await this.page.site.pwpage.keyboard.type(fioParts[0]);
        const firstNameInputEl = await pwpage.waitForSelector('[name="is[first_name]"]', {
            state: 'attached',
        });
        await firstNameInputEl.focus();
        await pwpage.keyboard.type(fioParts[1]);
        const middleNameInputEl = await pwpage.waitForSelector('[name="is[patronymic]"]', {
            state: 'attached',
        });
        await middleNameInputEl.focus();
        await pwpage.keyboard.type(fioParts[2]);

        const dobInputEl = await pwpage.waitForSelector('[name="is[date]"]', {
            state: 'attached',
        });
        await helpers.sleep(1000);
        await dobInputEl.focus();
        // await helpers.sleep(1000);
        await pwpage.keyboard.type(this.dob);

    }

    public async inputFio(fio: string) {

        const parts = fio.split(' ');
        if (parts.length !== 3) {
            throw new Error(`Invalid FIO: "${fio}"`);
        }

        let el;

        el = await pwpage.$('input[placeholder="Введите фамилию"]');
        await el.focus();
        await pwpage.keyboard.type(parts[0]);

        el = await pwpage.$('input[placeholder="Введите имя"]');
        await el.focus();
        await pwpage.keyboard.type(parts[1]);

        el = await pwpage.$('input[placeholder="Введите отчество"]');
        await el.focus();
        await pwpage.keyboard.type(parts[2]);
    }

    public async inputDob(dob: string) {
        const el = await pwpage.$('input[placeholder="Выберите дату"]');
        await el.focus();
        await pwpage.keyboard.type(dob);
    }

    public async inputRegion(region: string) {
        const el = await pwpage.$('input[placeholder="Выберите регион"]');
        await el.focus();
        await pwpage.keyboard.type(region);
        await pwpage.keyboard.press('Enter');
    }

    public async clickSearchButton() {
        const els = await pwpage.$$('a:visible');
        for (let i = 0; i < els.length; i++) {
            const text = (await els[i].getProperty('innerText'))
                .toString()
                .trim();
            if (text !== 'Найти') {
                continue;
            }
            // if (els[i].isHidden()) {
            //     console.log('el hidden');
            //     continue;
            // }
            // console.log('el found:');
            // console.log((await els[i].getProperty('outerHTML')).toString());
            await this.emit(
                'found-search-button',
                // (await els[i].getProperty('outerHTML')).toString(),
            );
            await els[i].click();
        }
        // const els = await pwpage.evaluate(() => {
        //     return [...document.querySelectorAll('a')]
        //         .filter(x => x.textContent.includes('Найти'))/*
        //         .map(x => x.outerHTML)*/;
        // });
        // console.log(els);

        // const el = await pwpage.$('a[text*="Найти"]');
        // console.log({ el });
        // await el.click();
    }
}
