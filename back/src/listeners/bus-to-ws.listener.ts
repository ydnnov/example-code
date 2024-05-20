import { bus } from '../bus.js';
import { websocket } from '../websocket.js';
import { AppEvent } from '../shared/classes/app-event.js';

export const busToWsListener = {
    bind() {
        // bus.onAny((eventName: string, ...args) => {
        //     console.log('='.repeat(80));
        //     console.log(eventName, args);
        //     console.log('='.repeat(80));
        //     const passArgs = [];
        //     for (let i = 0; i < args.length; i++) {
        //         try {
        //             JSON.stringify(args[i]);
        //             passArgs.push(args[i]);
        //         } catch (err) {
        //             passArgs.push({});
        //         }
        //     }
        //     websocket.sockets.emit(eventName + ' zxc', ...passArgs);
        //     // websocket.sockets.emit(eventName, ...passArgs);
        // });

        bus.onAny((eventName: string, appEvent: AppEvent<any>) => {
            if (appEvent.app.name === 'back') {
                console.log('='.repeat(80));
                console.log('== From bus ' + '='.repeat(68));
                console.log('='.repeat(80));
                console.log({ eventName, appEvent });
                console.log('='.repeat(80));
                websocket.sockets.emit(eventName + ' zxc', appEvent);
            }
        });

        websocket.on('connection', (socket) => {
            socket.onAny((eventName: string, appEvent: AppEvent<any>) => {
                if (appEvent.app.name === 'front') {
                    console.log('-'.repeat(80));
                    console.log('-- From websocket ' + '-'.repeat(62));
                    console.log(eventName);
                    console.log('-'.repeat(80));
                    console.log(appEvent);
                    console.log('-'.repeat(80));
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
