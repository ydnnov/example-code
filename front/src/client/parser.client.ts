import { ClientBase } from './client-base.js';
import type { GenericDictionary } from '../shared/schemas/common.js';

type ParserRunResponseType = {
    success: true,
    data: any,
} | {
    success: false,
    err: any,
}

export class ParserClient extends ClientBase {

    async run(
        parserName: string,
        inputData: GenericDictionary,
    ): Promise<ParserRunResponseType> {
        try {
            const response = await this.api.post('parser/start', {
                parserName,
                inputData,
            });
            // console.log(response);
            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                };
            } else {
                // console.log(response);
                return {
                    success: false,
                    err: response,
                };
            }
        } catch (err) {
            return {
                success: false,
                err,
            };
        }
    }
}
