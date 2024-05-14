import { bus } from '../bus.js';
import { websocket } from '../websocket.js';

export const busToWsListener = {
    bind() {
        // bus.on('headless:navigation-started', (payload) => {
        //     websocket.sockets.emit('headless:navigation-started', payload);
        // });
        //
        // bus.on('captcha:create-answer-request:success', (mgr, ansrecEnt) => {
        //     websocket.sockets.emit('captcha:create-answer-request:success', ansrecEnt);
        // });

        bus.onAny((eventName: string, ...args) => {
            websocket.sockets.emit(eventName, ...args);
        });

    },
};
