import { request } from '~/axios.js';

export const tsDefinitionsClient = {
    all: async () => {
        const result = await request.get('ts-definitions/all');
        return result.data;
    },
};
