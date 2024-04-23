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
  <div class="h-screen">
    <div class="absolute">
      <Button
          @click="swapPanels = !swapPanels"
          label="Swap panels"
          class="py-2 px-10 ml-3 my-2"
      />
    </div>
    <div class="pt-14">
      <Splitter
          state-key="index-page:main-splitter-state"
          state-storage="local"
      >
        <SplitterPanel>
          <keep-alive>
            <component :is="leftPanelComponent" />
          </keep-alive>
        </SplitterPanel>
        <SplitterPanel>
          <keep-alive>
            <component :is="rightPanelComponent" />
          </keep-alive>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>
