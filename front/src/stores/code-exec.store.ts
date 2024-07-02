import { defineStore } from 'pinia';
import { computed, reactive, ref, unref } from 'vue';
import { Static, Type } from '@sinclair/typebox';
import { useQuasar } from 'quasar';

export const codeExecTabSchema = Type.Object({
  id: Type.Number(),
  code: Type.String(),
});
export type CodeExecTabType = Static<typeof codeExecTabSchema>

export const useCodeExecStore = defineStore('code-exec', () => {
  const $q = useQuasar();
  const tabs = reactive<{
    items: CodeExecTabType[],
    currentId: number | null,
  }>({
    items: [
      {
        id: 1,
        code: '',
      },
    ],
    currentId: 1,
  });

  const tabIds = computed(() => {
    return tabs.items.map(x => x.id);
  });

  const nextTabId = computed(() => {
    const lastTab = tabs.items[tabs.items.length - 1];
    if (lastTab) {
      return lastTab.id + 1;
    }
    return 1;
  });

  const idByIndex = (index: number): number => {
    return tabs.items[index].id;
  };

  const indexById = (id: number): number => {
    return tabs.items.findIndex(x => x.id === id);
  };

  const tabById = (id: number): CodeExecTabType | null => {
    const idx = indexById(id);
    if (idx < 0) {
      return null;
    }
    return tabs.items[idx];
  };

  const currentTab = (): CodeExecTabType | null => {
    if (!tabs.currentId) {
      return null;
    }
    return tabById(tabs.currentId);
  };

  const neighbourTabIndex = (id: number): number => {
    const index = indexById(id);
    if (index < 0) {
      return -1;
    }
    if (index >= tabs.items.length - 1) {
      if (index <= 0) {
        return -1;
      }
      return index - 1;
    }
    return index + 1;
  };

  const neighbourTabId = (id: number): number | null => {
    const idx = neighbourTabIndex(id);
    if (idx < 0) {
      return null;
    }
    return tabs.items[idx].id;
  };

  const addTab = (code: string = ''): CodeExecTabType => {
    const id = nextTabId.value;
    // $q.notify(`adding tab with id=${id}`);
    const tab = { id, code };
    tabs.items.push(tab);
    return tab;
  };

  const selectTab = (id: number | null) => {
    // $q.notify(`selecting tab with id=${id}`);
    tabs.currentId = id;
  };

  const deleteTab = (id: number) => {
    const idx = indexById(id);
    if (idx >= 0) {
      // $q.notify(`deleting tab with id=${id}`);
      tabs.items.splice(idx, 1);
    }
  };

  return {
    tabs,
    tabIds,
    nextTabId,

    idByIndex,
    indexById,
    tabById,
    currentTab,

    neighbourTabIndex,
    neighbourTabId,

    addTab,
    selectTab,
    deleteTab,
  };
}, {
  // persist: false,
  persist: {
    paths: ['tabs'],
  },
});
