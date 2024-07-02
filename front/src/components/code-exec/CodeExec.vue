<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import '../../user-worker.js';
import {
  fasPlus as addTabIcon,
  fasXmark as closeTabIcon,
} from '@quasar/extras/fontawesome-v6';
import { useBagStore } from 'stores/bag.store.js';
import { useCodeExecStore } from 'stores/code-exec.store.js';
import { useQuasar } from 'quasar';
import { defaultCode } from 'components/code-exec/default-code.js';
import { client } from 'src/client/client.js';

const $q = useQuasar();

const ces = useCodeExecStore();

const { btran } = useBagStore();

let editor;
const editorEl = ref();
const codeExecSend = () => {
  client.codeExec.exec(editor.getValue());
};

const monacoFirstInit = () => {
  if (!editorEl.value) return;
  let code = ces.currentTab()?.code || '';
  const model = monaco.editor.createModel(
    code,
    'typescript',
    monaco.Uri.parse('file:///main.tsx'),
  );
  monacoCreateEditor(model);
};
const monacoReinit = () => {
  if (!editorEl.value) return;
  const models = monaco.editor.getModels();
  const model = models[0];
  monacoCreateEditor(model);
};
const monacoCreateEditor = (model) => {
  editor = monaco.editor.create(editorEl.value, {
    // value: ces.currentTab()?.code,
    fontSize: 14,
    language: 'typescript',
    automaticLayout: true,
    model,
  });
  // editor.focus();
  editor.getModel()?.onDidChangeContent((e) => {
    const tab = ces.currentTab();
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
onMounted(async () => {
  if (btran['init-monaco']) {
    monacoReinit();
    return;
  }
  btran['init-monaco'] = true;
  monacoFirstInit();
});
watch(() => ces.tabs.currentId, (id, oldId) => {
  if (!id) {
    return;
  }
  editor.getModel().setValue(ces.tabById(id)?.code);
});

const addTab = () => {
  const tab = ces.addTab();
  tab.code = defaultCode;
};
const deleteTab = (id: number | null) => {
  if (!id) {
    return;
  }
  const nid = ces.neighbourTabId(id);
  ces.selectTab(nid);
  ces.deleteTab(id);
};
</script>

<template>
  <div class="absolute left-0 right-[5px] inset-y-0">
    <div class="">
      <q-tabs
        v-model="ces.tabs.currentId"
        class="h-[50px]"
      >
        <q-tab
          v-for="(tab, i) in ces.tabs.items"
          :name="tab.id"
        >
          tab {{ i + 1 }}<!-- [{{ tab.id }}]-->
        </q-tab>
        <q-space />
        <div class="text-[18px] px-[20px] py-[10px]">{{ ces.tabs.currentId }}</div>
        <q-btn
          @click="addTab()"
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
    <div class="absolute top-[50px] bottom-[70px] inset-x-0 border-[1px] border-l-0 border-[#cde]">
      <div ref="editorEl"
           class="w-full h-full"
           v-show="ces.tabs.currentId"
      ></div>
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
