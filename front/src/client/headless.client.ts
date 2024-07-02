import { ClientBase } from './client-base.js';

export class HeadlessClient extends ClientBase {

    async getTabs() {
        const response = await this.api.get('headless/tabs');
        return response.data;
    }

    goto(url: string) {
        this.api.post('headless/goto', { url });
    }

    async getUrl() {
        const response = await this.api.get('headless/get-url');
        return response.data;
    }

    reloadPage() {
        this.api.post('headless/reload-page');
    }

    screenshotClick(x: number, y: number) {
        this.api.post(`headless/on-click`, { x, y });
    }

    screenshotType(key: string, code: string) {
        this.api.post(`headless/on-keypress`, { key, code });
    }
}
