import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useBagStore = defineStore('bag', () => {

  const bag = reactive({});

  return { bag };
}, {
  persist: true,
});
