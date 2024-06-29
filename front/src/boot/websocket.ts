import { boot } from 'quasar/wrappers';
import { io } from 'socket.io-client';
import { useEventBusStore } from 'stores/event-bus.store.js';
import { AppEvent } from 'src/shared/classes/app-event.js';
import { bus } from './bus.js';

const socket = io('http://localhost:5000');

export default boot(({ app }) => {

  const eventsStore = useEventBusStore();

  socket.onAny(async (eventName, appEvent: AppEvent<any>) => {
    if (eventName === 'update-screenshot') {
      return;
    }
    // console.log('From websocket:', { eventName, appEvent });
    if (appEvent.app.name === 'back') {
      // console.log('Reemitting', { eventName, appEvent });
      await bus.reemit(appEvent);
    }
  });

  bus.onAny((eventName: string, appEvent: AppEvent<any>) => {
    // console.log('Emitting:', { eventName, appEvent });
    socket.emit(eventName, appEvent);
    eventsStore.events.push(appEvent);
  });

});

export { socket };
