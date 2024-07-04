import { bus } from '../bus.js';
import { AppEvent } from '../shared/classes/app-event.js';

export const busEventsConsoleLogListener = {
    bind() {
        bus.onAny(async (eventName: string, appEvent: AppEvent<any>) => {
            let text = eventName;
            const payloadTxt = JSON.stringify(appEvent.payload);
            if (payloadTxt) {
                text += `, ${payloadTxt}`;
            }
            let result = `##### BUS: ${text} `;
            result += '#'.repeat(80 - result.length);
            console.log(result);
        });
    },
};
