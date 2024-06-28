import { bus } from '../bus.js';

export class EmitsToBus {
    protected eventPrefix: string = this.constructor.name;

    public async emit(eventName: string, payload?: any) {
        return bus.emit(`${this.eventPrefix}.${eventName}`, payload);
    }

    protected ep(eventName: string) {
        return `${this.eventPrefix}.${eventName}`;
    }
}
