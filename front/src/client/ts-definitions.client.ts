import { ClientBase } from './client-base.js';

export class TsDefinitionsClient extends ClientBase {

    async all() {
        const result = await this.api.get('ts-definitions/all');
        return result.data;
    }
}
