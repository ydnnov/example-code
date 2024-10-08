import * as fs from 'fs';
import { env } from '../envconf.js';

export class TsDefinitionsService {

    public async all() {

        const libFileNames = [
            // 'node_modules/.pnpm/playwright-core@1.43.1/node_modules/playwright-core/types/types.d.ts',
            // `${env.ROOT_PATH}/back/node_modules/.pnpm/typeorm@0.3.20_pg@8.11.5/node_modules/typeorm/index.d.ts`,
            // `${env.ROOT_PATH}/back/node_modules/.pnpm/playwright-core@1.43.1/node_modules/playwright-core/types/types.d.ts`,
            // `${env.ROOT_PATH}/back/node_modules/@types/node/fs.d.ts`,
        ];

        const appFileNames = [
            // `${env.ROOT_PATH}/back/declarations-build/dist/types/src/parsers/parsers.d.ts`,
            // `${env.ROOT_PATH}/back/declarations-build/dist/types/src/parsers/msudrf-sud-delo.parser.d.ts`,
            // `${env.ROOT_PATH}/back/declarations-build/dist/types/src/services/services.d.ts`,
            // `${env.ROOT_PATH}/back/declarations-build/dist/types/src/services/parser.service.d.ts`,
        ];

        const libCode = libFileNames
            .map(fileName => fs.readFileSync(fileName))
            .join('\n\n');

        const appCode = appFileNames
            .map(fileName =>
                this.stripImports(fs.readFileSync(fileName).toString()),
            )
            .join('\n\n');
        return libCode + '\n\n' + '/'.repeat(80) + '\n\n' + appCode;
    }

    protected stripImports(code: string): string {
        // code = code.replace(/import .+;[\n\r]*/g, '');
        return code;
    }
}
