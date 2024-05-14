import type { GenericDictionary } from '~/types/common.types.js';

export const useEventsStore = defineStore('events', () => {

    const events = ref<{
        eventName: string
        payload: GenericDictionary
    }[]>([]);

    return { events };
}, {
    persist: true,
});
