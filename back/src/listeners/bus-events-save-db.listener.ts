import { bus } from '../bus.js';
import { db } from '../data-source.js';
import { AppEvent } from '../shared/classes/app-event.js';
import { EventBus } from '../shared/classes/event-bus.js';
import { BusEventEntity } from '../entities/bus-event.entity.js';

export const busEventsSaveDbListener = {
    bind() {

        bus.onAny(async (eventName: string, appEvent: AppEvent<any>) => {
            const repo = db.getRepository(BusEventEntity);
            const eventEnt = new BusEventEntity();
            eventEnt.event_name = eventName;
            eventEnt.side = appEvent.app.name;
            eventEnt.payload = EventBus.stripPayloadCircularJson(appEvent.payload);
            await repo.save(eventEnt);
        });
    },
};
