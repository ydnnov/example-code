import { App } from './classes/app.js';

class BackApp extends App {

    protected lastEventId: number = 0;

    constructor() {
        super('back');
    }

    nextEventId(): number {
        this.lastEventId++;
        return this.lastEventId++;
    }
}

export const backApp = new BackApp();

export const app = () => backApp;
