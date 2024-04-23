<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import Button from 'primevue/button';
import '~/user-worker.js';
import { codeExecClient } from '~/client/code-exec.client.js';
import { useStorage } from '@vueuse/core';

let editor;
const editorEl = ref();
const codeExecSend = () => {
  codeExecClient.exec(editor.getValue());
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
onMounted(() => {
  if (!editorEl.value) return;

  editor = monaco.editor.create(editorEl.value, {
    value: getCurrentTab()?.code,
    language: 'typescript',
    automaticLayout: true,
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
  <div>
    <div style="display: flex; flex-wrap: wrap; margin: 3px 0 0 0;">
      <div v-for="(tab, i) in srcTabs.items" :key="tab.id" class="tab-button-wrapper">
        <Button
            :label="`Tab ${i + 1}`"
            class="tab-button"
            :severity="tab.id === srcTabs.currentId ? 'success' : 'secondary'"
            @click="selectTab(tab)"
        />
      </div>
      <div class="tab-button-wrapper">
        <Button icon="pi pi-plus" class="tab-button" @click="addTab" />
      </div>
      <div style="flex-grow: 1"></div>
      <Button
          class="close-tab-button icon-button"
          icon="pi pi-times"
          severity="danger"
          @click="closeCurrentTab"
      />
    </div>
    <div style="width: 100%; height: calc(100vh - 150px);">
      <div ref="editorEl" style="width: 100%; height: 100%;"></div>
    </div>
    <Button label="Execute (Ctrl+Enter)" @click="codeExecSend"></Button>
  </div>
</template>

<style lang="scss">
.tab-button-wrapper {
  margin: 0 3px 3px 0;
}

.tab-button.p-button {
  height: 32px;
  padding: 0 10px;
  font-size: 75%;

  span {
    font-weight: normal;
  }
}

.icon-button {
  width: 32px !important;
  height: 32px !important;
}

.close-tab-button {
  margin: 0 15px 3px 0 !important;
}

.monaco-editor, .overflow-guard {
  width: 100% !important;
}
</style>
