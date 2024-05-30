import { Page } from 'playwright';

export let pwpage: Page;

export const pwpageReadyPromise = new Promise((resolve) => {
    import('./services/services.js')
        .then(({ services }) => {
            services.headless.getPage()
                .then((result) => {
                    pwpage = result;
                    resolve();
                });
        });
});
