import { ClientBase } from '~/client/client-base.js';

export class EventBusClient extends ClientBase{

    emit(eventName: string, payload: string) {
        return this.request.post('event-bus/emit', { eventName, payload });
    }
}
