// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: false,
    srcDir: 'src',
    css: ['~/styles/styles.scss'],
    runtimeConfig: {
        public: {
            backendUrl: process.env.NUXT_BACKEND_URL || 'http://localhost:5000',
            websocketUrl: process.env.NUXT_WEBSOCKET_URL || 'http://localhost:5000',
        },
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: [
        'nuxt-primevue',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
    ],
    primevue: {
        options: {
            unstyled: false,
        },
    },
});
