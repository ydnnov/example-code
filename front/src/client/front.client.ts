import { ClientBase } from './client-base.js';

export class FrontClient extends ClientBase {

    async getInitData() {
        const response = await this.api.get('front/init-data');
        return response.data;
    }
}
