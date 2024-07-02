import { ClientBase } from './client-base.js';

export class HeadlessScreenshotsClient extends ClientBase {

    startSending() {
        this.api.post('headless-screenshots/start-sending');
    }

    stopSending() {
        this.api.post('headless-screenshots/stop-sending');
    }

    setSendInterval(interval: number) {
        this.api.post('headless-screenshots/set-send-interval', { interval });
    }
}
