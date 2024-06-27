import { FrontInitType } from '../shared/schemas/front/init.js';
import { pwpage } from '../pwpage.js';
import { parsing } from '../helpers/parsing.js';

export class FrontService {

    public async getInitData(): Promise<FrontInitType> {
        return {
            page: {
                url: pwpage.url(),
            },
            parser: {
                paused: parsing.paused,
            },
        };
    }
}
