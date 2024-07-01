import * as monaco from 'monaco-editor';

class MonacoInit {
  firstInit(code:string='') {
    console.log('MonacoInit::firstInit');
//   monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//     target: monaco.languages.typescript.ScriptTarget.ES2016,
//     allowNonTsExtensions: true,
//     moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
//     module: monaco.languages.typescript.ModuleKind.CommonJS,
//     noEmit: true,
//     typeRoots: ['node_modules/@types'],
//   });
//
// // extra libraries
//   monaco.languages.typescript.typescriptDefaults.addExtraLib(
//       `export declare function next() : string`,
//       'node_modules/@types/external/index.d.ts');
//
//   monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
//     noSemanticValidation: false,
//     noSyntaxValidation: false,
//   });
//
    // const tsDefinitions = await client.tsDefinitions.all();
    //
    // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    //   target: monaco.languages.typescript.ScriptTarget.ES2016,
    //   allowNonTsExtensions: true,
    //   moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    //   module: monaco.languages.typescript.ModuleKind.CommonJS,
    //   noEmit: true,
    //   typeRoots: ['node_modules/@types'],
    // });
    //
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(
    //   tsDefinitions,
    //   'file:///node_modules/@types/types/index.d.ts',
    // );
    //
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(
    //     tsDefinitions,
    //     'file:///node_modules/@types/playwright/index.d.ts',
    // );
    // let code = getCurrentTab()?.code;
    if (!code || !code.length) {
      code = `import * as playwright from 'types';
import { Browser, Page } from 'types';

declare const page: Page, browser: Browser;

`;
    }

    const model = monaco.editor.createModel(
      code,
      'typescript',
      monaco.Uri.parse('file:///main.tsx'),
    );
    ////////////////////////////////////////////////////////////////////////////////

    editor = monaco.editor.create(editorEl.value, {
      // value: getCurrentTab()?.code,
      fontSize: 18,
      language: 'typescript',
      automaticLayout: true,
      model,
    });

    editor.focus();

    editor.getModel()?.onDidChangeContent((e) => {
      const tab = getCurrentTab();
      if (tab) {
        tab.code = editor.getValue();
      }
    });

    editor.onKeyDown(e => {
      if (e.ctrlKey && e.code === 'Enter') {
        codeExecSend();
        e.stopPropagation();
      }
    });
  }

  reInit() {

  }
}

export const monacoInit = new MonacoInit();
