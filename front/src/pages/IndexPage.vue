<script setup lang="ts">
import PanelComponent from 'components/panel/PanelComponent.vue';
import PanelTree from 'components/panel/PanelTree.vue';
import { useUiStore } from 'stores/ui.store.js';

defineOptions({
  name: 'IndexPage',
});

const ui = useUiStore();
</script>

<template>
  <div class="relative w-[100vw] h-[100vh]">
    <q-splitter
      v-if="ui.sidebar.visible"
      v-model="ui.sidebar.width"
      :horizontal="false"
      class="absolute left-0 top-0 right-0 bottom-0"
    >
      <template v-slot:before>
        <q-splitter
          v-if="ui.sidebar.visible"
          v-model="ui.sidebar.panelTreeHeight"
          :horizontal="true"
          class="absolute left-0 top-0 right-0 bottom-0"
        >
          <template v-slot:before>
            <PanelTree />
          </template>
        </q-splitter>
      </template>
      <template v-slot:after>
        <PanelComponent :id="1" />
      </template>
    </q-splitter>
    <div v-else
         class="absolute inset-y-0 left-[0px] right-[0px] border-l-[3px] border-[#bbb]"
    >
      <PanelComponent :id="1" />
    </div>
  </div>
</template>
