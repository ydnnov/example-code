import { busToWsListener } from './bus-to-ws.listener.js';
import { wsHeadlessScreenshotsListener } from './ws-headless-screenshots.listener.js';
import { wsListener } from './ws.listener.js';

export const listeners = {
    bindAll() {
        busToWsListener.bind();
        wsHeadlessScreenshotsListener.bind();
        wsListener.bind();
    },
};
