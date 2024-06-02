import { ClientBase } from '~/client/client-base.js';

export class HeadlessScreenshotsClient extends ClientBase {

    startSending() {
        this.request.post('headless-screenshots/start-sending');
    }

    stopSending() {
        this.request.post('headless-screenshots/stop-sending');
    }

    setSendInterval(interval: number) {
        this.request.post('headless-screenshots/set-send-interval', { interval });
    }
}
