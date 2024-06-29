<script setup lang="ts">
import { ref, computed } from 'vue';
import { UiPanelType, useUiStore } from 'stores/ui.store.js';
import CodeExec from 'components/code-exec/CodeExec.vue';
import EventBus from 'components/event-bus/EventBus.vue';

import {
  fasArrowsLeftRight as swapPanelsVIcon,
  fasArrowsUpDown as swapPanelsHIcon,
  fasDesktop as changePanelsHorizIcon,
} from '@quasar/extras/fontawesome-v6';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const ui = useUiStore();

const panel = computed<UiPanelType>(() => ui.panels[props.id]);
</script>

<template>
  <div class="relative border-[0px] border-red-500 h-full">
    <div v-if="panel.type === 'splitter'"
         class="h-full"
    >
      <q-toolbar class="bg-primary text-white shadow-2 m-0 h-[50px]">

        <q-btn
          @click="panel.swapped = !panel.swapped"
          round
          color="primary"
          :icon="panel.horizontal ? swapPanelsHIcon : swapPanelsVIcon"
        />
        <q-btn
          @click="panel.horizontal = !panel.horizontal"
          round
          color="primary"
          :icon="changePanelsHorizIcon"
          class="ml-[10px]"
          :class="panel.horizontal ? 'rotate-90' : ''"
        />
      </q-toolbar>
      <q-splitter
        v-model="panel.position"
        :horizontal="panel.horizontal"
        class="absolute inset-x-0 top-[50px] bottom-0"
      >
        <template v-slot:before>
          <PanelComponent :id="panel.children[panel.swapped ? 1 : 0]" />
        </template>
        <template v-slot:after>
          <PanelComponent :id="panel.children[panel.swapped ? 0 : 1]" />
        </template>
      </q-splitter>
    </div>
    <div v-else-if="panel.type==='code-exec'">
      <!--      <KeepAlive>-->
      <CodeExec />
      <!--      </KeepAlive>-->
    </div>
    <div v-else-if="panel.type==='event-bus'">
      <EventBus />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
