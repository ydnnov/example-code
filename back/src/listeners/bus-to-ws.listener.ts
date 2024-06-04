import { bus } from '../bus.js';
import { websocket } from '../websocket.js';
import { AppEvent } from '../shared/classes/app-event.js';
import { EventBus } from '../shared/classes/event-bus.js';

export const busToWsListener = {
    bind() {

        bus.onAny((eventName: string, appEvent: AppEvent<any>) => {
            if (appEvent.app.name === 'back') {
                // if (eventName !== 'bk.captcha.create-answer-request.image-find-or-create') {
                //     console.log('='.repeat(80));
                //     console.log('== From bus ' + '='.repeat(68));
                //     console.log({ eventName, appEvent });
                //     console.log('='.repeat(80));
                // }
                appEvent.payload = EventBus.stripPayloadCircularJson(appEvent.payload);
                websocket.sockets.emit(eventName, appEvent);
            }
        });

        websocket.on('connection', (socket) => {
            socket.onAny((eventName: string, appEvent: AppEvent<any>) => {
                // if (eventName !== 'bk.captcha.create-answer-request.image-find-or-create') {
                //     console.log('-'.repeat(80));
                //     console.log('-- From websocket ' + '-'.repeat(62));
                //     console.log(appEvent);
                //     console.log('-'.repeat(80));
                // }
                if (appEvent.app.name === 'front') {
                    bus.reemit(appEvent);
                    // bus.emit(event.eventName, ...args);
                }
                // if (event.app.getName() === 'back') {
                //     bus.emit(event.eventName, ...args);
                // }
            });
        });
    },
};
