// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },
    ssr: false,
    srcDir: 'src',
    css: [
        // 'normalize.css/normalize.css',
        // 'primevue/resources/themes/aura-light-green/theme.css',
        // 'primeicons/primeicons.css',
        '~/styles/styles.scss',
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: [
        'nuxt-primevue',
    ],
    primevue: {
        options: {
            unstyled: false
        },
    },
});
