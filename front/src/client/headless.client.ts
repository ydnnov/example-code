import { request } from '~/axios.js';

export const headlessClient = {
    goto: (url: string) => {
        request.post('headless/goto', { url });
    },
    getUrl: async () => {
        const response = await request.get('headless/get-url');
        return response.data;
    },
    reloadPage: () => {
        request.post('headless/reload-page');
    },
    screenshotClick: (x: number, y: number) => {
        request.post(`headless/on-click`, { x, y });
    },
    screenshotType: (key: string, code: string) => {
        request.post(`headless/on-keypress`, { key, code });
    },
};
