export const useFrontInitStore = defineStore('front-init', () => {

    const data = ref({});

    return { data };
}, {
    persist: true,
});
