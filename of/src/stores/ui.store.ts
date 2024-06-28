export const useUiStore = defineStore('ui', () => {

    const ui = reactive({
        mainSplitter: {
            swapped: false,
            horizontal: true,
            panels: ['event-bus', 'headless'],
        },
    });

    return { ui };
}, {
    persist: true,
});
