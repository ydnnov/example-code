import { request } from '~/axios.js';
import type { GenericDictionary } from '~/shared/schemas/common.js';

export const parserClient = {
    run: async (parserName: string, inputData: GenericDictionary) => {
        const response = await request.post('parser/start', {
            parserName,
            inputData,
        });

        return response.data;
    },
};
