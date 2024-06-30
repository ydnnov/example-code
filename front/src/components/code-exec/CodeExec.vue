<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import '../../user-worker.js';
import { useStorage } from '@vueuse/core';
import {
  fasPlus as addTabIcon,
  fasXmark as closeTabIcon,
} from '@quasar/extras/fontawesome-v6';
import { useBagStore } from 'stores/bag.store.js';
import { useCodeExecStore } from 'stores/code-exec.store.js';
import { useQuasar } from 'quasar';

// import useClient from '~/composables/useClient.js';

// const client = useClient();
const $q = useQuasar();

const ces = useCodeExecStore();

const { btran } = useBagStore();

let editor;
const editorEl = ref();
const codeExecSend = () => {
  // client.codeExec.exec(editor.getValue());
};
// const srcTabs = useStorage('codeexec-controls:src-tabs', {
//   nextId: 2,
//   currentId: 1,
//   items: [{
//     id: 1,
//     code: '',
//   }],
// });
// const getTabById = (id: number) => {
//   const index = getTabIndexById(id);
//   if (index >= 0) {
//     return srcTabs.value.items[index];
//   }
//   return null;
// };
// const getTabIndexById = (id: number) => {
//   return srcTabs.value.items.findIndex(x => x.id === srcTabs.value.currentId);
// };
// const getCurrentTab = () => getTabById(srcTabs.value.currentId);
// const getCurrentTabIndex = () => getTabIndexById(srcTabs.value.currentId);
// const updateEditorCodeFromCurrentTab = () => editor.getModel().setValue(getCurrentTab()?.code);
// const selectTabByIndex = (index: number) => {
//   const tab = srcTabs.value.items[index];
//   srcTabs.value.currentId = tab.id;
//   updateEditorCodeFromCurrentTab();
// };
// const selectTabById = (id: number) => {
//   srcTabs.value.currentId = id;
//   updateEditorCodeFromCurrentTab();
// };
// const addTab = () => {
//   srcTabs.value.items.push({
//     id: srcTabs.value.nextId,
//     code: '',
//   });
//   selectTabById(srcTabs.value.nextId);
//   srcTabs.value.nextId++;
//   editor?.focus();
// };
// const selectTab = (tab) => {
//   srcTabs.value.currentId = tab.id;
//   if (!editor) {
//     return;
//   }
//   updateEditorCodeFromCurrentTab();
//   editor?.focus();
// };
// const closeCurrentTab = () => {
//   if (srcTabs.value.items.length <= 1) {
//     return;
//   }
//   const index = getCurrentTabIndex();
//   if (index < 0) {
//     return;
//   }
//   srcTabs.value.items.splice(index, 1);
//   if (index >= srcTabs.value.items.length) {
//     selectTabByIndex(index - 1);
//   } else {
//     selectTabByIndex(index);
//   }
//   editor?.focus();
// };
//

//
// const monacoFirstInit = () => {
//   console.log('monacoFirstInit');
//   if (!editorEl.value) return;
//   ////////////////////////////////////////////////////////////////////////////////
// //   monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
// //     target: monaco.languages.typescript.ScriptTarget.ES2016,
// //     allowNonTsExtensions: true,
// //     moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
// //     module: monaco.languages.typescript.ModuleKind.CommonJS,
// //     noEmit: true,
// //     typeRoots: ['node_modules/@types'],
// //   });
// //
// // // extra libraries
// //   monaco.languages.typescript.typescriptDefaults.addExtraLib(
// //       `export declare function next() : string`,
// //       'node_modules/@types/external/index.d.ts');
// //
// //   monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
// //     noSemanticValidation: false,
// //     noSyntaxValidation: false,
// //   });
// //
//   // const tsDefinitions = await client.tsDefinitions.all();
//   //
//   // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//   //   target: monaco.languages.typescript.ScriptTarget.ES2016,
//   //   allowNonTsExtensions: true,
//   //   moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
//   //   module: monaco.languages.typescript.ModuleKind.CommonJS,
//   //   noEmit: true,
//   //   typeRoots: ['node_modules/@types'],
//   // });
//   //
//   // monaco.languages.typescript.typescriptDefaults.addExtraLib(
//   //   tsDefinitions,
//   //   'file:///node_modules/@types/types/index.d.ts',
//   // );
//   //
//   // monaco.languages.typescript.typescriptDefaults.addExtraLib(
//   //     tsDefinitions,
//   //     'file:///node_modules/@types/playwright/index.d.ts',
//   // );
//   let code = getCurrentTab()?.code;
//   if (!code || !code.length) {
//     code = `import * as playwright from 'types';
// import { Browser, Page } from 'types';
//
// declare const page: Page, browser: Browser;
//
// `;
//   }
//
//   const model = monaco.editor.createModel(
//     code,
//     'typescript',
//     monaco.Uri.parse('file:///main.tsx'),
//   );
//   ////////////////////////////////////////////////////////////////////////////////
//
//   editor = monaco.editor.create(editorEl.value, {
//     // value: getCurrentTab()?.code,
//     fontSize: 18,
//     language: 'typescript',
//     automaticLayout: true,
//     model,
//   });
//
//   editor.focus();
//
//   editor.getModel()?.onDidChangeContent((e) => {
//     const tab = getCurrentTab();
//     if (tab) {
//       tab.code = editor.getValue();
//     }
//   });
//
//   editor.onKeyDown(e => {
//     if (e.ctrlKey && e.code === 'Enter') {
//       codeExecSend();
//       e.stopPropagation();
//     }
//   });
// };
// const monacoReinit = () => {
//   console.log('monacoReinit');
//   if (!editorEl.value) return;
//   ////////////////////////////////////////////////////////////////////////////////
//   let code = getCurrentTab()?.code;
//   if (!code || !code.length) {
//     code = `import * as playwright from 'types';
// import { Browser, Page } from 'types';
//
// declare const page: Page, browser: Browser;
//
// `;
//   }
//   console.log({ code });
//   const models = monaco.editor.getModels();
//
//   console.log({ models });
//   const model = models[0];
//   ////////////////////////////////////////////////////////////////////////////////
//
//   editor = monaco.editor.create(editorEl.value, {
//     // value: getCurrentTab()?.code,
//     fontSize: 18,
//     language: 'typescript',
//     automaticLayout: true,
//     model,
//   });
//
//   // editor.focus();
//
//   editor.getModel()?.onDidChangeContent((e) => {
//     const tab = getCurrentTab();
//     if (tab) {
//       tab.code = editor.getValue();
//     }
//   });
//
//   editor.onKeyDown(e => {
//     if (e.ctrlKey && e.code === 'Enter') {
//       codeExecSend();
//       e.stopPropagation();
//     }
//   });
//   // return;
// };
// onMounted(async () => {
//   // console.log('mounted');
//   if (btran['init-monaco']) {
//     monacoReinit();
//     return;
//   }
//   btran['init-monaco'] = true;
//   monacoFirstInit();
// });

const deleteTab = (id: number | null) => {
  if (!id) {
    $q.notify('no id');
    return;
  }
  $q.notify(`deleting id=${id}`);
  const nid = ces.neighbourTabId(id);
  if (!nid) {
    $q.notify('no nid');
    return;
  }
  $q.notify(`nid=${nid}`);
  ces.selectTab(nid);
  ces.deleteTab(id);
};

</script>

<template>
  <div class="absolute left-0 right-[5px] inset-y-0">
    <q-tabs
      :model-value="ces.tabs.currentId"
      @update:model-value="ces.selectTab"
      dense
    >
      <q-tab
        v-for="(tab, i) in ces.tabs.items"
        :name="tab.id"
      >
        {{ ces.indexById(tab.id) }}. tab
        [{{ tab.id }}-{{ ces.idByIndex(i - 1) }}/{{ i }}]
      </q-tab>
      <q-space />
      <div class="text-[18px] px-[20px] py-[10px]">{{ ces.tabs.currentId }}</div>
      <q-btn
        @click="ces.addTab()"
        size="10px"
        round
      >
        <q-icon
          :name="addTabIcon"
          size="18px"
          class="text-[#090]"
        />
      </q-btn>
      <q-btn
        @click="deleteTab(ces.tabs.currentId)"
        size="10px"
        round
        class="mr-[5px] ml-[15px]"
      >
        <q-icon
          :name="closeTabIcon"
          size="18px"
          class="text-[#d00]"
        />
      </q-btn>
    </q-tabs>
    <!--
        <div class="absolute left-[15px] right-0 top-[40px] h-[38px] flex bd z-20">
          <div
            v-for="(tab, i) in ces.tabs"
            :key="tab.id"
            class=""
          >
            <q-btn
              :label="`Tab ${i}`"
              class="mr-[5px] text-[11px]"
              :color="tab.id === ces.currentTabId ? 'primary' : 'grey'"
              @click="ces.currentTabId = tab.id"
            />
          </div>
          <div class="border-[0px] border-cyan-500 border-dashed">
            <q-btn
              :icon="addTabIcon"
              class="text-[11px]"
              color="secondary"
              @click="ces.addTab()"
            />
            <q-btn
              :icon="addTabIcon"
              class="text-[11px]"
              color="secondary"
              @click="ces.$rehydrate()"
            />
          </div>
          <div style="flex-grow: 1"></div>
          <div>
            <q-btn
              class="w-[32px] h-[32px]"
              :icon="closeTabIcon"
              color="red"
              round
              @click="ces.removeCurrentTab()"
            />
          </div>
        </div>
    -->
    <!--
        <div class="absolute left-[15px] right-0 top-[40px] h-[38px] flex bd z-20">
          <div
            v-for="(tab, i) in srcTabs.items"
            :key="tab.id"
            class=""
          >
            <q-btn
              :label="`Tab ${i + 1}`"
              class="mr-[5px] text-[11px]"
              :color="tab.id === srcTabs.currentId ? 'primary' : 'grey'"
              @click="selectTab(tab)"
            />
          </div>
          <div class="border-[0px] border-cyan-500 border-dashed">
            <q-btn
              :icon="addTabIcon"
              class="text-[11px]"
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
    -->
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
