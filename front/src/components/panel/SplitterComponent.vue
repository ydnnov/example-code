<script setup lang="ts">
import {
  fasArrowsLeftRight as swapPanelsIcon,
  // fasArrowsUpDown as swapPanelsHIcon,
  fasDesktop as changePanelsHorizIcon,
} from '@quasar/extras/fontawesome-v6';
import { biDiagram3 as toggleSidebarIcon } from '@quasar/extras/bootstrap-icons';
import { UiPanelSplitterType } from 'src/schemas/ui-panel.schema.js';
import ComponentPicker from 'components/panel/ComponentPicker.vue';
import PanelComponent from 'components/panel/PanelComponent.vue';
import { useUiStore } from 'stores/ui.store.js';

defineProps<{
  panel: UiPanelSplitterType
}>();

const ui = useUiStore();

const swapSplitterChildren = (splitterPanel: UiPanelSplitterType) => {
  const c = splitterPanel.children;
  [c[0], c[1]] = [c[1], c[0]];
  splitterPanel.position = 100 - splitterPanel.position;
};
</script>

<template>
  <div class="relative bg-primary text-white shadow-2 p-[2px]"
       :class="panel.horizontal ? 'w-[35px] h-full' : 'h-[35px] w-full'"
  >
    <q-btn
      @click="panel.horizontal = !panel.horizontal"
      round
      color="primary"
      size="10px"
    >
      <q-icon :name="changePanelsHorizIcon"
              :class="panel.horizontal ? 'rotate-90' : 'rotate-0'"
              />
    </q-btn>
    <q-btn
      @click="swapSplitterChildren(panel)"
      round
      color="primary"
      size="10px"
      :class="panel.horizontal ? 'mt-[10px]' : 'ml-[10px]'"
    >
      <q-icon :name="swapPanelsIcon"
              :class="panel.horizontal ? 'rotate-90' : 'rotate-0'"
      />
    </q-btn>
    <q-btn
      v-if="panel.isRoot"
      @click="ui.sidebar.visible = !ui.sidebar.visible"
      round
      color="primary"
      size="10px"
      :icon="toggleSidebarIcon"
      :class="panel.horizontal ? 'mt-[10px]' : 'ml-[10px]'"
    />
    <ComponentPicker
      :id="panel.children[0]"
      class="absolute"
      :style="panel.horizontal ? `top: 150px` : `left: 150px; top: 3px;`"
    />
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
</template>

<style scoped lang="scss">

</style>
