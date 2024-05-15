import { config } from '../config.js';
import { services } from '../services/services.js';
import { websocket } from '../websocket.js';

export const wsHeadlessScreenshotsListener = {
    bind() {
        websocket.on('connection', (socket) => {
            if (config.autoSendScreenshots) {
                services.headlessScreenshots.startSendingScreenshots();
            }
            socket.on('disconnect', () => {
                services.headlessScreenshots.stopSendingScreenshots();
            });
        });
    },
};
