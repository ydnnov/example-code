import { bus } from '../bus.js';
import { websocket } from '../websocket.js';
import { AppEvent } from '../shared/classes/app-event.js';
import { EventBus } from '../shared/classes/event-bus.js';

export const busToWsListener = {
    bind() {

        bus.onAny((eventName: string, appEvent: AppEvent<any>) => {
            if (appEvent.app.name === 'back') {
                appEvent.payload = EventBus.stripPayloadCircularJson(appEvent.payload);
                websocket.sockets.emit(eventName, appEvent);
            }
        });

        websocket.on('connection', (socket) => {
            socket.onAny((eventName: string, appEvent: AppEvent<any>) => {
                if (appEvent.app.name === 'front') {
                    bus.reemit(appEvent);
                }
            });
        });
    },
};
