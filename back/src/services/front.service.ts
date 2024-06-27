import { FrontInitType } from '../shared/schemas/front/init.js';

export class FrontService {

    public async getInitData(): Promise<FrontInitType> {
        return {
            page: {
                url: 'qweasd',
            },
            parser: {
                paused: true,
            },
        };
    }
}
