// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: false,
    srcDir: 'src',
    css: ['~/styles/styles.scss'],
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
            unstyled: false,
        },
    },
});
