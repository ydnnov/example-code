import { socket } from '~/socket-io.js';
import { bus } from '~/bus.js';
import { useEventsStore } from '~/stores/events.store.js';

export default defineNuxtPlugin(() => {
    const eventsStore = useEventsStore();
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
