<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import HeadlessControls from '~/components/HeadlessControls.vue';
import CodeExecControls from '~/components/CodeExecControls.vue';
import Button from 'primevue/button';
import { useStorage } from '@vueuse/core';

const showCaptcha = ref(false);

const swapPanels = useStorage('index:swapPanels', false);

const splitterHorizontal =
    useStorage('index:splitterHorizontal', false);

const leftPanelComponent = computed(
    () => swapPanels.value ? HeadlessControls : CodeExecControls,
);
const rightPanelComponent = computed(
    () => !swapPanels.value ? HeadlessControls : CodeExecControls,
);
</script>

<template>
  <div class="fixed inset-x-0 inset-y-0">
    <div class="absolute inset-x-0 top-0">
      <div class="absolute">
        <Button
            @click="swapPanels = !swapPanels"
            :icon="`pi pi-arrows-${splitterHorizontal ? 'h' : 'v'}`"
            class="w-[40px] h-[40px] ml-3 my-2 hover:bg-cyan-400"
        />
        <Button
            @click="splitterHorizontal = !splitterHorizontal"
            icon="`pi pi-desktop"
            class="w-[40px] h-[40px] ml-3 my-2 hover:bg-cyan-400"
            :class="splitterHorizontal ? '' : 'rotate-90'"
        />
      </div>
      <CaptchaManualInput
          class="absolute right-0 top-[8px]"
          @image-received="showCaptcha = true"
      />
    </div>
    <div
        class="absolute inset-x-0 bottom-0 border-t-[2px] border-cyan-500"
        :class="showCaptcha||true ? 'top-[116px]' : 'top-[40px]'"
    >
      <Splitter
          class="absolute inset-x-0 inset-y-0 border-0"
          state-key="index-page:main-splitter-state"
          state-storage="local"
          gutter-size="12"
          :layout="splitterHorizontal ? 'horizontal' : 'vertical'"
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
