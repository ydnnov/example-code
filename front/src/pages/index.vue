<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import HeadlessControls from '~/components/HeadlessControls.vue';
import CodeExecControls from '~/components/CodeExecControls.vue';
import Button from 'primevue/button';
import { useStorage } from '@vueuse/core';

const swapPanels = useStorage('index:swapPanels', false);
const leftPanelComponent = computed(
    () => swapPanels.value ? HeadlessControls : CodeExecControls,
);
const rightPanelComponent = computed(
    () => !swapPanels.value ? HeadlessControls : CodeExecControls,
);
</script>

<template>
  <div>
    <Button
        @click="swapPanels = !swapPanels"
        style="font-size: 80%; height: 32px;"
        label="Swap panels"
    />
    <Splitter
        style="height: calc(100vh - 15px)"
        state-key="index-page:main-splitter-state"
        state-storage="local"
    >
      <SplitterPanel style="">
        <keep-alive>
          <component :is="leftPanelComponent" />
        </keep-alive>
      </SplitterPanel>
      <SplitterPanel style="display: flex; flex-direction: column">
        <keep-alive>
          <component :is="rightPanelComponent" />
        </keep-alive>
      </SplitterPanel>
    </Splitter>
  </div>
</template>
