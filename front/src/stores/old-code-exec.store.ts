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
  // const tabs = reactive<{
  //   id: number
  //   code: string
  // }[]
  // >([
  //   {
  //     id: 1,
  //     code: '',
  //   },
  //   {
  //     id: 2,
  //     code: '',
  //   },
  // ]);
  //
  // const currentTabIndex = ref<number | null>(null);
  //
  // const nextTabId = computed(() => {
  //   if (!currentTabIndex.value) {
  //     return 1;
  //   }
  //   const result = Number(tabs[tabs.length - 1].id) + 1;
  //   return result;
  // });
  //
  // const addTab = (code: string = '') => {
  //   const id = nextTabId.value + 1;
  //   tabs.push({ id, code });
  // };
  //
  // const removeCurrentTab = () => {
  //   // const ids = Object.keys(tabs);
  //   // const index = ids.findIndex(x => Number(x) === Number(currentTabId.value));
  //   // const deleteId = Number(currentTabId.value);
  //   // if (index >= ids.length - 1) {
  //   //   if (index > 0) {
  //   //     currentTabId.value = Number(ids[index - 1]);
  //   //   } else {
  //   //     currentTabId.value = null;
  //   //   }
  //   // } else {
  //   //   currentTabId.value = Number(ids[index + 1]);
  //   // }
  //   delete tabs[currentTabIndex.value];
  // };
  //
  // return {
  //   tabs,
  //   currentTabIndex,
  //   nextTabId,
  //   addTab,
  //   removeCurrentTab,
  // };
  //
  // const oldtabs = reactive<{
  //   [id: number]: {
  //     id: number
  //     code: string
  //   }
  // }>({
  //   1: {
  //     id: 1,
  //     code: '',
  //   },
  // });
  const $q = useQuasar();
  const tabs = reactive<{
    items: {
      [id: number]: CodeExecTabType
    },
    currentId: number | null,
  }>({
    items: {
      1: {
        id: 1,
        code: '',
      },
      2: {
        id: 2,
        code: '',
      },
      3: {
        id: 3,
        code: '',
      },
    },
    currentId: 1,
  });

  const tabIds = computed(() => {
    return Object.keys(tabs.items);
  });

  const idByIndex = (index: number): number | null => {
    const ids = Object.keys(tabs.items);
    if (!ids.length) {
      return null;
    }
    const result = Number(ids[index]);
    return result;
  };

  const indexById = (id: number): number => {
    const ids = Object.keys(tabs.items);
    if (!ids.length) {
      return -1;
    }
    const result = ids.findIndex(x => Number(x) === id);
    if (result < 0) {
      return -1;
    }
    return result;
  };

  const nextTabId = computed(() => {
    const ids = Object.keys(tabs.items);
    if (!ids.length) {
      return 1;
    }
    const result = Number(ids[ids.length - 1]) + 1;
    return result;
  });

  const selectTab = (id: number) => {
    tabs.currentId = id;
  };

  const addTab = (code: string = ''): number => {
    const id = nextTabId.value;
    tabs.items[id] = { id, code };
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

  const neighbourTabId = (id: number): number | null => {
    const ids = Object.keys(tabs.items);
    const index = indexById(id);
    if (index < 0) {
      return null;
    }
    if (index >= ids.length - 1) {
      if (index <= 0) {
        return null;
      }
      return Number(ids[index - 1]);
    }
    return Number(ids[index + 1]);
  };

  const deleteTab = (id: number) => {
    const items = JSON.parse(JSON.stringify(unref(tabs.items)));
    $q.notify(JSON.stringify(items))
    delete items[id];
    $q.notify(JSON.stringify(items))
    tabs.items = items;
  };

  return {
    tabs,
    selectTab,
    tabIds,
    nextTabId,
    // removeCurrentTab,

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
