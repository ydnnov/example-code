import { bus } from '../bus.js';
import { AppEvent } from '../shared/classes/app-event.js';

export const busEventsConsoleLogListener = {
    bind() {

        bus.onAny(async (eventName: string, appEvent: AppEvent<any>) => {
            console.log(eventName);
        });
    },
};
