import { ClientBase } from '~/client/client-base.js';

export class FrontClient extends ClientBase {

    async getInitData() {
        const response = await this.request.get('front/init-data');
        return response.data;
    }
}
