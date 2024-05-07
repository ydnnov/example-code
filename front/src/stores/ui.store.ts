export const useUiStore = defineStore('ui', () => {

    const ui = reactive({
        mainSplitter: {
            swapped: false,
            horizontal: false,
            panels: ['headless', 'code-exec'],
        },
    });

    return { ui };
}, {
    persist: true,
});
