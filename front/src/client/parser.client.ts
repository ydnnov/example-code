import { request } from '~/axios.js';

export const parserClient = {
    run: async (parserName: string, inputData: { [k: string]: any }) => {
        return request.post('parser/start', {
            parserName,
            inputData,
        });
    },
};
