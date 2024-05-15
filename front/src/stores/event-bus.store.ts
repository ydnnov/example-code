import type { GenericDictionary } from '~/types/common.types.js';

export const useEventBusStore = defineStore('events', () => {

    const events = ref<{
        eventName: string
        payload: GenericDictionary
    }[]>([]);

    const form = ref<{
        eventName: string
        payload: string
    }>({
        eventName: '',
        payload: '',
    });

    return { events, form };
}, {
    persist: true,
});
