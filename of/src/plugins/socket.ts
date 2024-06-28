import { io } from 'socket.io-client';

export default defineNuxtPlugin({
    name: 'websocket-plugin',
    setup() {
        const config = useRuntimeConfig();
        const socket = io(config.public.websocketUrl);

        return {
            provide: { socket },
        };
    },
});
