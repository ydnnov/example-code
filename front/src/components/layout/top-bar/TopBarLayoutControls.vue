<script setup lang="ts">
import Button from 'primevue/button';
import { useUiStore } from '~/stores/ui.store.js';

const { ui } = useUiStore();
</script>

<template>
  <div class="">
    <Button
        @click="ui.mainSplitter.swapped = !ui.mainSplitter.swapped"
        :icon="`pi pi-arrows-${ui.mainSplitter.horizontal ? 'h' : 'v'}`"
        class="w-[40px] h-[40px] ml-4"
    />
    <Button
        @click="ui.mainSplitter.horizontal = !ui.mainSplitter.horizontal"
        icon="pi pi-desktop"
        class="w-[40px] h-[40px] ml-2"
        :class="ui.mainSplitter.horizontal ? '' : 'rotate-90'"
    />
  </div>
  <div class="ml-2 border-l-[3px] border-black-500">
    <Button
        @click="ui.mainSplitter.panels[1] = 'code-exec'"
        icon="pi pi-code"
        class="w-[40px] h-[40px] ml-4"
    />
    <Button
        @click="ui.mainSplitter.panels[1] = 'event-bus'"
        icon="pi pi-align-left"
        class="w-[40px] h-[40px] ml-2"
    />
  </div>
</template>

<style scoped lang="scss">

</style>