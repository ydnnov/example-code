import { ClientBase } from '~/client/client-base.js';

export class HeadlessClient extends ClientBase {

    goto(url: string) {
        this.request.post('headless/goto', { url });
    }

    async getUrl() {
        const response = await this.request.get('headless/get-url');
        return response.data;
    }

    reloadPage() {
        this.request.post('headless/reload-page');
    }

    screenshotClick(x: number, y: number) {
        this.request.post(`headless/on-click`, { x, y });
    }

    screenshotType(key: string, code: string) {
        this.request.post(`headless/on-keypress`, { key, code });
    }
}
