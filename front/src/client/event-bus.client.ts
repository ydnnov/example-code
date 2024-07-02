import { ClientBase } from './client-base.js';

export class EventBusClient extends ClientBase{

    emit(eventName: string, payload: string) {
        return this.api.post('event-bus/emit', { eventName, payload });
    }
}
