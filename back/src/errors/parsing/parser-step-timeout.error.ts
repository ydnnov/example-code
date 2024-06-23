export class ParserStepTimeoutError extends Error {
    public readonly stepKey: string;

    constructor(stepKey: string) {
        super('Parser step timeout');
        this.stepKey = stepKey;
    }
}
