import { request } from '~/axios.js';
import type { GenericDictionary } from '~/shared/schemas/common.js';

export const parserClient = {
    run: async (parserName: string, inputData: GenericDictionary) => {
        const response = new Promise((resolve, reject) => {
            request.post('parser/start', {
                parserName,
                inputData,
            })
                .then(response => {
                    console.log(response.data);
                    resolve(response);
                })
                .catch(error => {
                    console.log(error);
                });
        });
    },
};
