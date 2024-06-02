import { ClientBase } from '~/client/client-base.js';

export class TsDefinitionsClient extends ClientBase {

    async all() {
        const result = await this.request.get('ts-definitions/all');
        return result.data;
    }
}
