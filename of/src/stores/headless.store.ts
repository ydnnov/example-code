import type { HeadlessTabType } from '~/shared/schemas/headless/headless.js';

export const useHeadlessStore = defineStore('headless', () => {

    const client = useClient();

    const tabs = ref<{
        [id: number]: HeadlessTabType
    }>({
        1: {
            id: 1,
            url: 'qwer',
        },
        2: {
            id: 2,
            url: 'asdf',
        },
    });

    const loadTabs = async () => {
        tabs.value = await client.headless.getTabs();
    };

    return { tabs, loadTabs };
}, {
    persist: false,
});
