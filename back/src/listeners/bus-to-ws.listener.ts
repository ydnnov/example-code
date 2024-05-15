import { bus } from '../bus.js';
import { websocket } from '../websocket.js';

export const busToWsListener = {
    bind() {
        bus.onAny((eventName: string, ...args) => {
            const passArgs = [];
            for (let i = 0; i < args.length; i++) {
                try {
                    JSON.stringify(args[i]);
                    passArgs.push(args[i]);
                } catch (err) {
                    passArgs.push({});
                }
            }
            websocket.sockets.emit(eventName, ...passArgs);
        });

    },
};
