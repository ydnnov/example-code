import useClient from '~/composables/useClient.js';
import type { FrontInitType } from '~/shared/schemas/front/init.js';

export const useFrontStore = defineStore('front', () => {

    const client = useClient();

    const isLoaded = ref<boolean>(false);

    const frontInitData = ref<FrontInitType>();

    const reloadInitData = async () => {
        const data = await client.front.getInitData();
        console.log({ data });
        frontInitData.value = data;
        isLoaded.value = true;
    };

    return { frontInitData, isLoaded, reloadInitData };
}, {
    persist: false,
});
