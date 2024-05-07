import { socket } from '~/socket-io.js';

export default defineNuxtPlugin(() => {
    socket.onAny((eventName, payload) => {
        // console.log({ eventName, payload });
    });
});

// const { events } = useEventsStore();
// console.log(events.length);
