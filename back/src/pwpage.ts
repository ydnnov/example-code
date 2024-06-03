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

export const pwpageRecreate = async () => {
    const { services } = await import('./services/services.js');
    pwpage = await services.headless.recreatePage();
};
