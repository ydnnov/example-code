import * as fs from 'fs';

export class TsDefinitionsService {

    public async all() {

        const libFileNames = [
            'node_modules/.pnpm/playwright-core@1.43.1/node_modules/playwright-core/types/types.d.ts',
        ];

        const appFileNames = [
            'declarations-build/dist/types/parsers/parsers.d.ts',
            'declarations-build/dist/types/parsers/msudrf-sud-delo.parser.d.ts',
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
        code = code.replace(/import .+;[\n\r]*/g, '');
        return code;
    }
}
