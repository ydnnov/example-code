import { ClientBase } from '~/client/client-base.js';
import type { GenericDictionary } from '~/shared/schemas/common.js';

export class ParserClient extends ClientBase {

    async run(parserName: string, inputData: GenericDictionary) {
        const response = await this.request.post('parser/start', {
            parserName,
            inputData,
        });

        return response.data;
    }
}
