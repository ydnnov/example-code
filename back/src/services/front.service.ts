import { FrontInitType } from '../shared/schemas/front/init.js';
import { pwpage } from '../pwpage.js';
import { parsing } from '../helpers/parsing.js';

export class FrontService {

    public async getInitData(): Promise<FrontInitType> {
        return {
            contexts: [
                {
                    id: 1,
                    url: 'qwe',
                },
                {
                    id: 2,
                    url: 'asdf',
                },
            ],
            page: {
                url: pwpage.url(),
            },
            parser: {
                paused: parsing.paused,
            },
        };
    }
}
