import useClient from '~/composables/useClient.js';
import type { FrontInitType } from '~/shared/schemas/front/init.js';
import { bus } from '~/bus.js';

bus.onAny((...args) => {
    console.log('parsing store');
    console.log({ args });
});

export const useParsingStore = defineStore('parsing', async () => {

    const client = useClient();

    // client.

    const isLoaded = ref<boolean>(false);

    const frontInitData = ref<FrontInitType>();

    const reloadInitData = async () => {
        const data = await client.front.getInitData();
        frontInitData.value = data;
        isLoaded.value = true;
    };

    return { frontInitData, isLoaded, reloadInitData };
}, {
    persist: false,
});
