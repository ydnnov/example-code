import { bus } from '../bus.js';
import { type GenericDictionary } from '../shared/schemas/common.js';

export class EventBusService {

    public async emit(eventName: string, payload: GenericDictionary) {
        console.log('emitting', { eventName, payload });
        return bus.emit(eventName, payload);
    }
}
