import { request } from '~/axios.js';

export const headlessScreenshotsClient = {
  startSending: () => {
    request.post('headless-screenshots/start-sending');
  },
  stopSending: () => {
    request.post('headless-screenshots/stop-sending');
  },
  setSendInterval: (interval: number) => {
    request.post('headless-screenshots/set-send-interval', { interval });
  },
};
