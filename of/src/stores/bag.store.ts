export const useBagStore = defineStore('bag', () => {

    const bag = reactive({});

    return { bag };
}, {
    persist: true,
});
