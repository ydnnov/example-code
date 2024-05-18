import { request } from '~/axios.js';

export const eventBusClient = {
    emit: (eventName: string, payload?: string) => {
        return request.post('event-bus/emit', {
            eventName,
            payload,
        }, {
            // headers: { 'Content-Type': 'text/plain' },
        });
    },
};
