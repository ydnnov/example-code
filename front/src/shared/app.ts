import { App } from '~/shared/classes/app.js';

class FrontApp extends App {

    protected lastEventId: number = 0;

    // getName(): 'front' | 'back' {
    //     return 'front';
    // }

    constructor() {
        super('front');
    }

    nextEventId(): number {
        this.lastEventId++;
        return this.lastEventId++;
    }
}

export const frontApp = new FrontApp();

export const app = () => frontApp;
