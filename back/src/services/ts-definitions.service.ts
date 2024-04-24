import * as fs from 'fs';

export class TsDefinitionsService {

    public async all() {
        const playwrightContent = fs.readFileSync(
            'node_modules/.pnpm/playwright-core@1.43.1/node_modules/playwright-core/types/types.d.ts',
        );
        return playwrightContent;
    }
}
