<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUiStore } from 'stores/ui.store.js';
import CodeExec from 'components/code-exec/CodeExec.vue';
import EventBus from 'components/event-bus/EventBus.vue';
import {
  fasArrowsLeftRight as swapPanelsVIcon,
  fasArrowsUpDown as swapPanelsHIcon,
  fasDesktop as changePanelsHorizIcon,
} from '@quasar/extras/fontawesome-v6';
import ComponentPicker from 'components/panel/ComponentPicker.vue';
import { useQuasar } from 'quasar';
import { UiPanelSplitterType, UiPanelType } from 'src/schemas/ui-panel.schema.js';
import HeadlessComponent from 'components/headless/HeadlessComponent.vue';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const ui = useUiStore();

const panel = computed<UiPanelType>(() => ui.panels[props.id]);
const swapSplitterChildren = (splitterPanel: UiPanelSplitterType) => {
  const c = splitterPanel.children;
  [c[0], c[1]] = [c[1], c[0]];
  splitterPanel.position = 100 - splitterPanel.position;
};
</script>

<template>
  <div class="relative border-[0px] border-red-500 h-full">
    <div v-if="panel.type === 'empty'">
      <div>Empty panel</div>
    </div>
    <div v-else-if="panel.type === 'splitter'"
         class="h-full"
    >
      <div class="relative bg-primary text-white shadow-2 p-[2px]"
           :class="panel.horizontal ? 'w-[35px] h-full' : 'h-[35px] w-full'"
      >
        <q-btn
          @click="swapSplitterChildren(panel)"
          round
          color="primary"
          size="10px"
          :icon="panel.horizontal ? swapPanelsHIcon : swapPanelsVIcon"
        />
        <q-btn
          @click="panel.horizontal = !panel.horizontal"
          round
          color="primary"
          size="10px"
          :icon="changePanelsHorizIcon"
          :class="panel.horizontal ? 'rotate-90 mt-[10px]' : 'ml-[10px]'"
        />

        <ComponentPicker
          :id="panel.children[0]"
          class="absolute"
          :style="panel.horizontal ? `top: 150px` : `left: 150px; top: 3px;`"
        />
        <!--        <div class="w-[150px]"></div>-->
        <ComponentPicker
          :id="panel.children[1]"
          class="absolute"
          :style="panel.horizontal ? `bottom: 50px` : `right: 50px; top: 3px;`"
        />

      </div>
      <q-splitter
        v-model="panel.position"
        :horizontal="panel.horizontal"
        class="absolute right-0 bottom-0"
        :class="panel.horizontal ? 'left-[35px] top-0' : 'left-0 top-[35px]'"
      >
        <template v-slot:before>
          <PanelComponent :id="panel.children[0]" />
        </template>
        <template v-slot:after>
          <PanelComponent :id="panel.children[1]" />
        </template>
      </q-splitter>
    </div>
    <div v-else-if="panel.type==='code-exec'">
      <CodeExec />
    </div>
    <div v-else-if="panel.type==='event-bus'">
      <EventBus />
    </div>
    <div v-else-if="panel.type==='headless'">
      <HeadlessComponent />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
