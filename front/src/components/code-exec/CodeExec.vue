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
import { MonacoInit } from 'components/code-exec/monaco-init.js';

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

const monacoFontSize = 14;

const monacoFirstInit = () => {
  console.log('monacoFirstInit');
  if (!editorEl.value) return;
  ////////////////////////////////////////////////////////////////////////////////

  // const monacoInit = new MonacoInit();
  // monacoInit.firstInit();
  // return;

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
    fontSize: monacoFontSize,
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
};
const monacoReinit = () => {
  console.log('monacoReinit');
  if (!editorEl.value) return;
  ////////////////////////////////////////////////////////////////////////////////
  let code = getCurrentTab()?.code;
  if (!code || !code.length) {
    code = `import * as playwright from 'types';
import { Browser, Page } from 'types';

declare const page: Page, browser: Browser;

`;
  }
  console.log({ code });
  const models = monaco.editor.getModels();

  console.log({ models });
  const model = models[0];
  ////////////////////////////////////////////////////////////////////////////////

  editor = monaco.editor.create(editorEl.value, {
    // value: getCurrentTab()?.code,
    fontSize: monacoFontSize,
    language: 'typescript',
    automaticLayout: true,
    model,
  });

  // editor.focus();

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
  // return;
};
onMounted(async () => {
  // console.log('mounted');
  if (btran['init-monaco']) {
    monacoReinit();
    return;
  }
  btran['init-monaco'] = true;
  monacoFirstInit();
});

const deleteTab = (id: number | null) => {
  if (!id) {
    return;
  }
  const nid = ces.neighbourTabId(id);
  if (nid) {
    ces.selectTab(nid);
  }
  ces.deleteTab(id);
};
</script>

<template>
  <div class="absolute left-0 right-[5px] inset-y-0">
    <div class="">
      <q-tabs
        :model-value="ces.tabs.currentId"
        @update:model-value="ces.selectTab"
        dense
        class="border-[0px] border-red-500"
      >
        <q-tab
          v-for="(tab, i) in ces.tabs.items"
          :name="tab.id"
        >
          {{ i + 1 }}. tab [{{ tab.id }}]
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
    </div>
    <div class="absolute top-[50px] bottom-[70px] inset-x-0 border-[2px] border-[#cde]">
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
