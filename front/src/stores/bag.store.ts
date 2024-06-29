import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useBagStore = defineStore('bag', () => {

  const bag = reactive({});
  const btran = reactive<{
    [k: string]: any
  }>({});
  return { bag, btran };
}, {
  persist: {
    paths: ['bag'],
  },
});
