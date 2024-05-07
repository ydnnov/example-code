export const useEventsStore = defineStore('events', () => {

    const events = reactive([]);

    return { events };
}, {
    persist: false,
});
