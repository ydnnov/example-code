import { App } from './src/classes/app.js';

class SharedApp extends App {

    getName(): 'front' | 'back' {
        throw new Error();
    }

    nextEventId(): number {
        throw new Error();
    }
}

const sharedApp = new SharedApp();

export const app = () => sharedApp;
