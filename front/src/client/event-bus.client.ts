import { api } from 'boot/axios.js';

export const eventBusClient = {

  emit: (eventName: string, payload: string) => {
    return api.post('event-bus/emit', { eventName, payload });
  },
};
