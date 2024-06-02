import { bus } from '~/bus.js';
import { useEventBusStore } from '~/stores/event-bus.store.js';
import type { AppEvent } from '~/shared/classes/app-event.js';
import useWebsocket from '~/composables/useWebsocket.js';

export default defineNuxtPlugin({
    dependsOn: ['websocket-plugin'],
    setup() {
        const eventsStore = useEventBusStore();
        const socket = useWebsocket();

        socket.onAny(async (eventName, appEvent: AppEvent<any>) => {
            if (eventName === 'update-screenshot') {
                return;
            }
            console.log('From websocket:', { eventName, appEvent });
            if (appEvent.app.name === 'back') {
                console.log('Reemitting', { eventName, appEvent });
                await bus.reemit(appEvent);
            }
        });

        bus.onAny((eventName: string, appEvent: AppEvent<any>) => {
            console.log('Emitting:', { eventName, appEvent });
            socket.emit(eventName, appEvent);
            eventsStore.events.push(appEvent);
        });
    },
});
