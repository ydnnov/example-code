<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { useUiStore } from '~/stores/ui.store.js';
import { useFrontStore } from '~/stores/front.store.js';
import TopBar from '~/components/layout/TopBar.vue';
import CodeExec from '~/components/code-exec/CodeExec.vue';
import HeadlessControls from '~/components/headless/HeadlessControls.vue';
import EventBus from '~/components/event-bus/EventBus.vue';

const showCaptcha = ref(false);

const { ui } = useUiStore();
const frontStore = useFrontStore();
await frontStore.reloadInitData();


const componentByKey = (key: string) => {
  switch (key) {
    case 'headless':
      return HeadlessControls;
    case 'code-exec':
      return CodeExec;
    case 'event-bus':
      return EventBus;
  }
};

const componentKeyA = computed(() =>
    ui.mainSplitter.panels[ui.mainSplitter.swapped ? 1 : 0]);
const componentKeyB = computed(() =>
    ui.mainSplitter.panels[ui.mainSplitter.swapped ? 0 : 1]);
const ComponentA = computed(() => componentByKey(componentKeyA.value));
const ComponentB = computed(() => componentByKey(componentKeyB.value));
</script>

<template>
  <Toast />
  <Suspense>
    <div>
      <TopBar />
      <div class="fixed inset-x-0 top-[50px] bottom-0 bg-red-00">
        <div class="absolute inset-x-0 top-[10px]">
          <div class="absolute flex">
          </div>
          <CaptchaManualInput
              class="absolute right-0 top-[8px]"
              @image-received="showCaptcha = true"
          />
        </div>
        <div
            class="absolute inset-x-0 bottom-0 border-t-[2px] border-cyan-500"
            :class="showCaptcha||true ? 'top-[116px]' : 'top-[40px]'"
            v-if="frontStore.isLoaded"
        >
          <Splitter
              class="absolute inset-x-0 inset-y-0 border-0"
              state-key="index-page:main-splitter-state"
              state-storage="local"
              :gutter-size="12"
              :layout="ui.mainSplitter.horizontal ? 'horizontal' : 'vertical'"
          >
            <SplitterPanel>
              <keep-alive>
                <component :is="ComponentA" />
              </keep-alive>
            </SplitterPanel>
            <SplitterPanel>
              <keep-alive>
                <component :is="ComponentB" />
              </keep-alive>
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
    </div>
  </Suspense>
</template>
