export abstract class App {

    public abstract nextEventId(): number;

    constructor(public readonly name: 'front' | 'back') {
    }
}
