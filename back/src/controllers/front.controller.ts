import { services } from '../services/services.js';

export class FrontController {

    public async getInitData() {
        return await services.front.getInitData();
    }

}

export const frontController = new FrontController();
