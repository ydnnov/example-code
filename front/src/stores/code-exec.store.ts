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

  const neighbourTabIndex = (id: number): number | -1 => {
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

  const addTab = (code: string = ''): number => {
    const id = nextTabId.value;
    tabs.items.push({ id, code });
    return id;
  };

  const selectTab = (id: number) => {
    $q.notify(`selectTab ${id}`);
    tabs.currentId = id;
  };

  const deleteTab = (id: number) => {
    const idx = indexById(id);
    if (idx >= 0) {
      tabs.items.splice(idx, 1);
    }
    if (!tabs.items.length) {
      tabs.currentId = null;
    }
  };

  return {
    tabs,
    tabIds,
    nextTabId,

    idByIndex,
    indexById,

    neighbourTabIndex,
    neighbourTabId,

    addTab,
    selectTab,
    deleteTab,
  };
}, {
  persist: {
    paths: ['tabs'],
  },
});
