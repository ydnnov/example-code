export const useUserStore = defineStore('user', () => {
    const user = {
        id: 1,
        name: 'admin',
    };

    return {
        user,
    };
});
