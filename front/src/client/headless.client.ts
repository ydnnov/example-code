import { request } from '~/axios.js';

export const headlessClient = {
  goto: (url: string) => {
    request.post('headless/goto', { url });
  },
  reloadPage: () => {
    request.post('headless/reload-page');
  },
  screenshotClick: (x: number, y: number) => {
    request.post(`headless/on-click`, { x, y });
  },
  screenshotType: (code: string) => {
    request.post(`headless/on-keypress`, { code });
  },
};
