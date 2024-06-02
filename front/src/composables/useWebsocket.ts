import { Socket } from 'socket.io-client';

export default function useWebsocket() {

    const { $socket } = useNuxtApp() as { $socket: Socket };

    return $socket;
}
