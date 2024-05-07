import { busToWsListener } from './bus-to-ws.listener.js';

export const listeners = {
    bindAll() {
        busToWsListener.bind();
    },
};
