import { pwpage } from '../../pwpage.js';
import { helpers } from '../../helpers/helpers.js';
import { StdResult } from '../../types/common.js';
import { ElementHandle } from 'playwright';
import { EmitsToBus } from '../../classes/emits-to-bus.js';
import { services } from '../../services/services.js';

export class FsspSefizlicoForm extends EmitsToBus {

    protected eventPrefix = 'fssp-sefizlico-form';

    protected formSel = 'form[class*="-MainFilter"]';
    protected expandButtonSel = 'div[class*="-FormButtonReset"]';
    protected expandButtonText = 'расширенный поиск';
    protected startModalCloseSel = 'div[class*="-ModalClose"]';

    public async expandForm() {
        await this.emit('expanding-form');
        const expandButtonWait = await this.findExpandButton();
        if (!expandButtonWait.success) {
            return null;
        }
        await expandButtonWait.buttonEl.click();
        // await pwpage.goto(this.pageUrl);
    }

    public async findExpandButton(): Promise<StdResult<{
        buttonEl: ElementHandle
    }>> {
        const buttonEl = await pwpage.$(this.expandButtonSel);
        if (!buttonEl) {
            return {
                success: false,
                err: 'Element does not exists',
            };
        }
        const buttonText = (await buttonEl.getProperty('innerText')).toString();
        if (buttonText.toLocaleLowerCase().trim() !== this.expandButtonText) {
            return {
                success: false,
                err: 'Element has wrong text',
            };
        }
        return {
            success: true,
            buttonEl,
        };
    }

    public async waitReady(timeout: number): Promise<boolean> {
        try {
            const expandButtonWait = await helpers.pollWait(
                () => this.findExpandButton(),
                500,
                5000,
            );
            console.log({ expandButtonWait });
            if (!expandButtonWait.success) {
                await this.emit('error.failed-waiting-ready');
                return false;
            }
            await this.emit('ready');
            return true;
        } catch (err) {
            await this.emit('error.error.failed-waiting-ready');
            return false;
        }
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
