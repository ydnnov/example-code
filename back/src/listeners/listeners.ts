import { busEventsConsoleLogListener } from './bus-events-console.log.listener.js';
import { busEventsSaveDbListener } from './bus-events-save-db.listener.js';
import { busToWsListener } from './bus-to-ws.listener.js';
import { wsHeadlessScreenshotsListener } from './ws-headless-screenshots.listener.js';
import { wsListener } from './ws.listener.js';

export const listeners = {
    bindAll() {
        busEventsConsoleLogListener.bind();
        busEventsSaveDbListener.bind();
        busToWsListener.bind();
        wsHeadlessScreenshotsListener.bind();
        wsListener.bind();
    },
};
