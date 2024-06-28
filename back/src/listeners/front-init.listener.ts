import { helpers } from '../helpers/helpers.js';
import { logger } from '../logger.js';
import { websocket } from '../websocket.js';

export const wsListener = {
    bind() {
        websocket.on('connection', (socket) => {
            logger.verbose(`${
                helpers.fmtDateTime(new Date())
            }: wss connected client id = ${socket.id}`);

            socket.on('disconnect', () => {
                logger.verbose(`${
                    helpers.fmtDateTime(new Date())
                }: wss disconnected client id = ${socket.id}`);
            });
        });
    },
};
