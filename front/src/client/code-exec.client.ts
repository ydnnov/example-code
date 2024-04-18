import { request } from '~/axios.js';

export const codeExecClient = {
  exec: (code: string) => {
    request.post('code-exec', code, {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
