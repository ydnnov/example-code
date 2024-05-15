import { bus } from '~/bus.js';
import { socket } from '~/socket-io.js';
import { useEventBusStore } from '~/stores/event-bus.store.js';

export default defineNuxtPlugin(() => {

    const eventsStore = useEventBusStore();

    socket.onAny(async (eventName, payload) => {
        if (eventName === 'update-screenshot') {
            return;
        }
        await bus.emitAsync(eventName, payload);
    });

    bus.onAny((eventName: string, payload) => {
        eventsStore.events.push({ eventName, payload });
    });
});
