export abstract class App {

    public abstract getName(): 'front' | 'back';

    public abstract nextEventId(): number;
    
}
