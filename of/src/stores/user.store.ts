export const useUserStore = defineStore('user', () => {
    const user = reactive({
        id: 1,
        name: 'admin',
    });

    return {
        user,
    };
});
