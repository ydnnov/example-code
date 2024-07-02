import { ClientBase } from './client-base.js';

export class CodeExecClient extends ClientBase {

    exec(code: string) {
        this.api.post('code-exec', code, {
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}
