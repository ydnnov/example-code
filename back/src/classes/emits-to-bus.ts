import { bus } from '../bus.js';
import { eventNS, ListenerFn, OnOptions } from 'eventemitter2';

export class EmitsToBus {
    protected eventPrefix: string = this.constructor.name;

    public emit(
        eventName: string,
        payload?: any,
    ): Promise<any[]> {
        return bus.emit(`${this.eventPrefix}.${eventName}`, payload);
    }

    public on(
        event: string | eventNS,
        listener: ListenerFn,
        options?: boolean | OnOptions,
    ) {
        return bus.on(`${this.eventPrefix}.${event}`, listener, options);
    }

    public once(
        event: string | eventNS,
        listener: ListenerFn,
        options?: true | OnOptions,
    ) {
        return bus.once(`${this.eventPrefix}.${event}`, listener, options);
    }

    protected ep(eventName: string) {
        return `${this.eventPrefix}.${eventName}`;
    }
}
