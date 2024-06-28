import { ClientBase } from '~/client/client-base.js';

export class CodeExecClient extends ClientBase {

    exec(code: string) {
        this.request.post('code-exec', code, {
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}
