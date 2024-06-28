import axios from 'axios';

export default defineNuxtPlugin(nuxtApp => {

    const config = useRuntimeConfig();

    const request = axios.create({
        baseURL: config.public.backendUrl,
    });

    return {
        provide: { request },
    };
});
