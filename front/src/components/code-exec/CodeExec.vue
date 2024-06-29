<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import '../../user-worker.js';
import { useStorage } from '@vueuse/core';
import {
  fasPlus as addTabIcon,
  fasXmark as closeTabIcon,
} from '@quasar/extras/fontawesome-v6';

// import useClient from '~/composables/useClient.js';

// const client = useClient();

let editor;
const editorEl = ref();
const codeExecSend = () => {
  // client.codeExec.exec(editor.getValue());
};
const srcTabs = useStorage('codeexec-controls:src-tabs', {
  nextId: 2,
  currentId: 1,
  items: [{
    id: 1,
    code: '',
  }],
});
const getTabById = (id: number) => {
  const index = getTabIndexById(id);
  if (index >= 0) {
    return srcTabs.value.items[index];
  }
  return null;
};
const getTabIndexById = (id: number) => {
  return srcTabs.value.items.findIndex(x => x.id === srcTabs.value.currentId);
};
const getCurrentTab = () => getTabById(srcTabs.value.currentId);
const getCurrentTabIndex = () => getTabIndexById(srcTabs.value.currentId);
const updateEditorCodeFromCurrentTab = () => editor.getModel().setValue(getCurrentTab()?.code);
const selectTabByIndex = (index: number) => {
  const tab = srcTabs.value.items[index];
  srcTabs.value.currentId = tab.id;
  updateEditorCodeFromCurrentTab();
};
const selectTabById = (id: number) => {
  srcTabs.value.currentId = id;
  updateEditorCodeFromCurrentTab();
};
const addTab = () => {
  srcTabs.value.items.push({
    id: srcTabs.value.nextId,
    code: '',
  });
  selectTabById(srcTabs.value.nextId);
  srcTabs.value.nextId++;
  editor?.focus();
};
const selectTab = (tab) => {
  srcTabs.value.currentId = tab.id;
  if (!editor) {
    return;
  }
  updateEditorCodeFromCurrentTab();
  editor?.focus();
};
const closeCurrentTab = () => {
  if (srcTabs.value.items.length <= 1) {
    return;
  }
  const index = getCurrentTabIndex();
  if (index < 0) {
    return;
  }
  srcTabs.value.items.splice(index, 1);
  if (index >= srcTabs.value.items.length) {
    selectTabByIndex(index - 1);
  } else {
    selectTabByIndex(index);
  }
  editor?.focus();
};
onMounted(async () => {
  if (!editorEl.value) return;
  ////////////////////////////////////////////////////////////////////////////////
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
  let code = getCurrentTab()?.code;
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
});
</script>

<template>
  <div class="absolute left-0 right-[5px] inset-y-0">
    <div class="absolute left-[15px] right-0 top-0 h-[38px] flex bd z-20">
      <div
        v-for="(tab, i) in srcTabs.items"
        :key="tab.id"
        class=""
      >
        <q-btn
          :label="`Tab ${i + 1}`"
          class="h-[32px] mr-[5px] text-[14px]"
          :color="tab.id === srcTabs.currentId ? 'primary' : 'grey'"
          @click="selectTab(tab)"
        />
      </div>
      <div class="border-[0px] border-cyan-500 border-dashed">
        <q-btn
          :icon="addTabIcon"
          class="h-[32px]"
          color="secondary"
          @click="addTab"
        />
      </div>
      <div style="flex-grow: 1"></div>
      <div>
        <q-btn
          class="w-[32px] h-[32px]"
          :icon="closeTabIcon"
          color="red"
          round
          @click="closeCurrentTab"
        />
      </div>
    </div>
    <div class="absolute top-[40px] bottom-[70px] inset-x-0">
      <div ref="editorEl" style="width: 100%; height: 100%;"></div>
    </div>
    <div class="absolute left-[15px] bottom-0 h-[52px] z-20">
      <q-btn
        label="Execute (Ctrl+Enter)"
        color="primary"
        @click="codeExecSend"
      />
    </div>
  </div>
</template>

<style lang="scss">
.p-splitter-panel {
  position: relative;
}

.monaco-editor, .overflow-guard {
  width: 100% !important;
}
</style>
