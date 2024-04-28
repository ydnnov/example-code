<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import HeadlessControls from '~/components/HeadlessControls.vue';
import CodeExecControls from '~/components/CodeExecControls.vue';
import Button from 'primevue/button';
import { useStorage } from '@vueuse/core';
import MsudrfSudDeloParser from '~/components/parsers/MsudrfSudDeloParser.vue';
import EventBus from '~/components/EventBus.vue';
import TopBar from '~/components/layout/TopBar.vue';

const showCaptcha = ref(false);

const swapPanels = useStorage('index:swapPanels', false);
const componentA = useStorage('index:componentA', 'headless');
const componentB = useStorage('index:componentB', 'code-exec');
const componentByKey = (key: string) => {
  switch (key) {
    case 'headless':
      return HeadlessControls;
    case 'code-exec':
      return CodeExecControls;
    case 'event-bus':
      return EventBus;
    case 'msudrf-sud-delo':
      return MsudrfSudDeloParser;
  }
};
const panelAComponent = computed(
    () => swapPanels.value ? componentByKey(componentA.value)
        : componentByKey(componentB.value),
);
const panelBComponent = computed(
    () => !swapPanels.value ? componentByKey(componentA.value)
        : componentByKey(componentB.value),
);

const splitterHorizontal =
    useStorage('index:splitterHorizontal', false);
</script>

<template>
  <TopBar />
  <div class="fixed inset-x-0 top-[50px] bottom-0 bg-red-00">
    <div class="absolute inset-x-0 top-[10px]">
      <div class="absolute flex">
        <div class="mt-3">
          <Button
              @click="swapPanels = !swapPanels"
              :icon="`pi pi-arrows-${splitterHorizontal ? 'h' : 'v'}`"
              class="w-[40px] h-[40px] ml-4"
          />
          <Button
              @click="splitterHorizontal = !splitterHorizontal"
              icon="pi pi-desktop"
              class="w-[40px] h-[40px] ml-2"
              :class="splitterHorizontal ? '' : 'rotate-90'"
          />
        </div>
        <div class="ml-4 mt-3 border-l-[3px] border-black-500">
          <Button
              @click="componentB = 'code-exec'"
              icon="pi pi-code"
              class="w-[40px] h-[40px] ml-4"
          />
          <Button
              @click="componentB = 'event-bus'"
              icon="pi pi-align-left"
              class="w-[40px] h-[40px] ml-2"
          />
        </div>
        <div class="ml-4 mt-3 border-l-[3px] border-black-500">
          <Button
              @click="componentB = 'msudrf-sud-delo'"
              icon="pi pi-microchip"
              class="w-[40px] h-[40px] ml-4"
          />
        </div>
        <div class="ml-4 mt-3 border-l-[3px] border-black-500">
          <Button
              @click=""
              icon="pi pi-asterisk"
              class="w-[40px] h-[40px] ml-4"
          />
          <Button
              @click=""
              icon="pi pi-asterisk"
              class="w-[40px] h-[40px] ml-2"
          />
        </div>
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
            <component :is="panelAComponent" />
          </keep-alive>
        </SplitterPanel>
        <SplitterPanel>
          <keep-alive>
            <component :is="panelBComponent" />
          </keep-alive>
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>
