// import type { GenericDictionary } from '~/types/common.types.js';
import type { AppEvent } from '~/shared/classes/app-event.js';

export const useEventBusStore = defineStore('events', () => {

    const events = ref<AppEvent<any>[]>([]);

    const form = ref<{
        eventName: string
        payload: string
    }>({
        eventName: '',
        payload: '',
    });

    return { events, form };
    // const events = ref<{
    //     eventName: string
    //     payload: GenericDictionary
    // }[]>([]);
    //
    // const form = ref<{
    //     eventName: string
    //     payload: string
    // }>({
    //     eventName: '',
    //     payload: '',
    // });
    //
    // return { events, form };
}, {
    persist: true,
});
