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
      {
        id: 2,
        code: '',
      },
      {
        id: 3,
        code: '',
      },
    ],
    currentId: 1,
  });

  const tabIds = computed(() => {
    return tabs.items.map(x => x.id);
  });

  const idByIndex = (index: number): number => {
    return tabs.items[index].id;
  };

  const indexById = (id: number): number => {
    return tabs.items.findIndex(x => x.id === id);
  };

  const tabById = (id: number): CodeExecTabType | undefined => {
    return tabs.items.find(x => x.id === id);
  };

  const nextTabId = computed(() => {
    return tabs.items[tabs.items.length - 1].id + 1;
  });

  const selectTab = (id: number) => {
    $q.notify(`selectTab ${id}`);
    tabs.currentId = id;
  };

  const addTab = (code: string = ''): number => {
    const id = nextTabId.value;
    tabs.items.push({ id, code });
    return id;
  };

  // const removeCurrentTab = () => {
  //   const ids = Object.keys(tabs);
  //   const index = ids.findIndex(x => Number(x) === Number(currentTabId.value));
  //   const deleteId = Number(currentTabId.value);
  //   if (index >= ids.length - 1) {
  //     if (index > 0) {
  //       currentTabId.value = Number(ids[index - 1]);
  //     } else {
  //       currentTabId.value = null;
  //     }
  //   } else {
  //     currentTabId.value = Number(ids[index + 1]);
  //   }
  //   delete tabs[deleteId];
  // };

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

  const deleteTab = (id: number) => {
    const idx = indexById(id);
    if (idx >= 0) {
      tabs.items.splice(idx, 1);
    }
  };

  return {
    tabs,
    selectTab,
    tabIds,
    nextTabId,
    // removeCurrentTab,

    neighbourTabIndex,
    neighbourTabId,

    addTab,
    deleteTab,

    idByIndex,
    indexById,
  };
}, {
  // persist: false,
  persist: true,
  // persist: {
  //   paths: ['tabs'],
  //   beforeRestore: (context) => {
  //     console.log('beforeRestore', context);
  //   },
  // },
});
