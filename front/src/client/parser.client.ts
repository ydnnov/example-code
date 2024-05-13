import { request } from '~/axios.js';
import type { GenericDictionary } from '~/types/common.types.js';

export const parserClient = {
    run: async (parserName: string, inputData: GenericDictionary) => {
        return request.post('parser/start', {
            parserName,
            inputData,
        });
    },
};
