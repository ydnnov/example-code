import { GenericDictionary } from '../types/common.js';
import { App } from './app.js';
import { app } from '../app.js';

export class AppEvent<TPayload extends GenericDictionary> {

    public app: App;

    public createdAt: Date;

    public id: number;

    constructor(
        public eventName: string,
        public payload: TPayload,
    ) {
        this.app = app();
        this.createdAt = new Date();
        this.id = this.app.nextEventId();
    }
}
