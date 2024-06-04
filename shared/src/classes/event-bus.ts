import EventEmitter2, {
    EventAndListener, eventNS, ListenerFn, OnOptions,
} from 'eventemitter2';
import { AppEvent } from './app-event.js';
import { app } from '../app.js';

export class EventBus {

    protected emitter: EventEmitter2 = new EventEmitter2();

    public static stripPayloadCircularJson(payload) {
        if (typeof payload === 'string' ||
            typeof payload === 'number' ||
            typeof payload === 'undefined' ||
            payload === null
        ) {
            return payload;
        }
        const keys = Object.keys(payload);
        const result = {};
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            try {
                JSON.stringify(payload[key]);
                result[key] = payload[key];
            } catch (err) {
                result[key] = {};
            }
        }
        return result;
    }

    public emit(
        eventName: string,
        payload?: any,
    ): Promise<any[]> {

        const event = new AppEvent(
            eventName,
            payload,
        );

        return this.emitter.emitAsync(eventName, event);
    }

    public reemit<T>(appEvent: AppEvent<T>): Promise<any[]> {
        // console.log(`Reemitting on ${app().name} side`, appEvent);
        return this.emitter.emitAsync(appEvent.eventName, appEvent);
    }

    public emitSync(
        eventName: string,
        payload: any,
    ): boolean {

        const event = new AppEvent(
            eventName,
            payload,
        );

        return this.emitter.emit(eventName, event);
    }

    public on(
        event: string | eventNS,
        listener: ListenerFn,
        options?: boolean | OnOptions,
    ) {
        return this.emitter.on(event, listener, options);
    }

    public once(
        event: string | eventNS,
        listener: ListenerFn,
        options?: true | OnOptions,
    ) {
        return this.emitter.once(event, listener, options);
    }

    public onAny(
        listener: EventAndListener,
    ) {
        return this.emitter.onAny(listener);
    }
}
