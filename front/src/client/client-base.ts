import type { Axios } from 'axios';

export class ClientBase {
    constructor(protected api: Axios) {
    }
}
